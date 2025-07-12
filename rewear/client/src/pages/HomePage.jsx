import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { itemsService } from '../services/items.service';
import ItemCard from '../components/items/ItemCard';
import Loader from '../components/common/Loader';

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured items
        const featuredResponse = await itemsService.getFeaturedItems();
        setFeaturedItems(featuredResponse.data);
        
        // Fetch categories
        const categoriesResponse = await itemsService.getCategories();
        setCategories(categoriesResponse.data);
        
        // Fetch items for first page
        const itemsResponse = await itemsService.getItems({ 
          page: currentPage, 
          limit: itemsPerPage 
        });
        
        setItems(itemsResponse.data.items);
        setTotalPages(Math.ceil(itemsResponse.data.total / itemsPerPage));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // The useEffect will trigger a new fetch
  };

  // Create pagination items
  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item 
        key={number} 
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <section className="hero-section mb-5">
        <Row>
          <Col md={12}>
            <div className="text-center mb-4">
              <h1>ReWear - Community Clothing Exchange</h1>
              <p className="lead">
                Exchange unused clothing through direct swaps or our point-based redemption system.
                Join our sustainable fashion movement!
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/items">
                  <Button variant="primary">Browse Items</Button>
                </Link>
                <Link to="/items/new">
                  <Button variant="success">List an Item</Button>
                </Link>
                <Link to="/swaps">
                  <Button variant="outline-primary">Start Swapping</Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* Featured Items Carousel */}
      <section className="featured-items mb-5">
        <h2 className="section-title mb-4">Featured Items</h2>
        <Carousel>
          {featuredItems.length > 0 ? (
            featuredItems.map((item, index) => (
              <Carousel.Item key={item.id}>
                <Row className="justify-content-center">
                  <Col md={8} lg={6}>
                    <Card>
                      <Card.Img 
                        variant="top" 
                        src={item.imageUrl} 
                        alt={item.title} 
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                      <Card.Body className="text-center">
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>
                          {item.description.substring(0, 100)}...
                        </Card.Text>
                        <Link to={`/items/${item.id}`}>
                          <Button variant="outline-primary">View Details</Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Carousel.Item>
            ))
          ) : (
            <Carousel.Item>
              <div className="text-center py-5">
                <p>No featured items available at the moment.</p>
              </div>
            </Carousel.Item>
          )}
        </Carousel>
      </section>

      {/* Categories Section */}
      <section className="categories mb-5">
        <h2 className="section-title mb-4">Categories</h2>
        <Row>
          {categories.map((category) => (
            <Col key={category.id} xs={6} md={4} lg={2} className="mb-4">
              <Card className="category-card text-center h-100">
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  <Button variant="link" disabled>
                    View Items
                  </Button>
                  <small className="d-block text-muted">
                    (Coming in next phase)
                  </small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Recent Items */}
      <section className="recent-items">
        <h2 className="section-title mb-4">Recent Items</h2>
        <Row>
          {items.length > 0 ? (
            items.map((item) => (
              <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <ItemCard item={item} />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="text-center py-4">
                <p>No items available at the moment.</p>
              </div>
            </Col>
          )}
        </Row>
        
        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
            
            {paginationItems}
            
            <Pagination.Next 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      </section>
    </Container>
  );
};

export default HomePage;