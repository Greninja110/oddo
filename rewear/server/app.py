import os
import logging
from datetime import datetime, timezone
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from config.settings import config
from config.database import db, migrate
from utils.logger import configure_logger

# Setup logging
log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'logs')
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, 'app.log')
logger = configure_logger(log_file)

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(config)

# Initialize extensions
db.init_app(app)
migrate.init_app(app, db)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# Import API routes
from api.users import users_bp
from api.items import items_bp
from api.swaps import swaps_bp
from api.admin import admin_bp

# Register blueprints
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(items_bp, url_prefix='/api/items')
app.register_blueprint(swaps_bp, url_prefix='/api/swaps')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

# JWT error handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_data):
    return jsonify({
        'status': 'error',
        'message': 'Token has expired',
        'code': 'token_expired'
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        'status': 'error',
        'message': 'Signature verification failed',
        'code': 'invalid_token'
    }), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({
        'status': 'error',
        'message': 'Authorization header is missing',
        'code': 'authorization_header_missing'
    }), 401

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'status': 'error',
        'message': 'Resource not found'
    }), 404

@app.errorhandler(500)
def internal_server_error(error):
    logger.error(f"Internal Server Error: {error}")
    return jsonify({
        'status': 'error',
        'message': 'Internal server error'
    }), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'success',
        'message': 'API is running',
        'timestamp': datetime.now(timezone.utc).isoformat()
    })

# Setup database tables
@app.before_first_request
def create_tables():
    with app.app_context():
        db.create_all()


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)