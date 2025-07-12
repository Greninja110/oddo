import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Table, Button, Badge, Form, Alert } from 'react-bootstrap';
import { FaUsers, FaBoxOpen, FaExchangeAlt, FaUserCheck, FaUserTimes, FaCheck, FaTimes } from 'react-icons/fa';
import Loader from '../common/Loader';
import Pagination from '../common/Pagination';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, you would fetch data from your API
        // For now, we'll simulate loading with mock data
        setTimeout(() => {
          // Mock users data
          const mockUsers = Array(25).fill().map((_, idx) => ({
            id: idx + 1,
            username: `user${idx + 1}`,
            email: `user${idx + 1}@example.com`,
            status: idx % 3 === 0 ? 'pending' : 'approved',
            registeredAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
          }));
          
          // Mock items data
          const mockItems = Array(30).fill().map((_, idx) => ({
            id: idx + 1,
            title: `Item ${idx + 1}`,
            category: ['Shirts', 'Pants', 'Jackets', 'Shoes'][idx % 4],
            status: ['pending', 'approved', 'rejected'][idx % 3],
            owner: `user${Math.floor(Math.random() * 25) + 1}`,
            listedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
          }));
          
          setUsers(mockUsers);
          setItems(mockItems);
          setTotalPages(Math.ceil(mockUsers.length / itemsPerPage));
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [itemsPerPage]);

  // Handle search filter
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle status filter
  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle user approval/rejection
  const handleUserAction = (userId, action) => {
    // In a real app, you would call your API here
    console.log(`User ${userId} ${action}`);
    
    // Update local state to reflect the change
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, status: action === 'approve' ? 'approved' : 'rejected' };
      }
      return user;
    }));
    
    // Show success message
    setActionSuccess(`User ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Handle item approval/rejection
  const handleItemAction = (itemId, action) => {
    // In a real app, you would call your API here
    console.log(`Item ${itemId} ${action}`);
    
    // Update local state to reflect the change
    setItems(items.map(item => {
      if (item.id === itemId) {
        return { ...item, status: action === 'approve' ? 'approved' : 'rejected' };
      }
      return item;
    }));
    
    // Show success message
    setActionSuccess(`Item ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Filter data based on search term and status filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Paginate data
  const paginateData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Panel</h1>
      
      {actionSuccess && (
        <Alert variant="success" dismissible onClose={() => setActionSuccess(null)}>
          {actionSuccess}
        </Alert>
      )}
      
      <Card>
        <Card.Body>
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Row>
              <Col md={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="users" className="d-flex align-items-center">
                      <FaUsers className="me-2" /> Manage Users
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="items" className="d-flex align-items-center">
                      <FaBoxOpen className="me-2" /> Manage Listings
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="orders" className="d-flex align-items-center">
                      <FaExchangeAlt className="me-2" /> Manage Orders
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              
              <Col md={9}>
                <Tab.Content>
                  {/* Users Tab */}
                  <Tab.Pane eventKey="users">
                    <h2 className="mb-3">Manage Users</h2>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            placeholder="Search by username or email"
                            value={searchTerm}
                            onChange={handleSearch}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Select value={filterStatus} onChange={handleStatusFilter}>
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </Form.Select>
                      </Col>
                    </Row>
                    
                    <Table responsive striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Registered</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateData(filteredUsers).map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                              {user.status === 'pending' && (
                                <Badge bg="warning">Pending</Badge>
                              )}
                              {user.status === 'approved' && (
                                <Badge bg="success">Approved</Badge>
                              )}
                              {user.status === 'rejected' && (
                                <Badge bg="danger">Rejected</Badge>
                              )}
                            </td>
                            <td>{new Date(user.registeredAt).toLocaleDateString()}</td>
                            <td>
                              {user.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="success" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleUserAction(user.id, 'approve')}
                                  >
                                    <FaUserCheck /> Approve
                                  </Button>
                                  <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleUserAction(user.id, 'reject')}
                                  >
                                    <FaUserTimes /> Reject
                                  </Button>
                                </>
                              )}
                              {user.status !== 'pending' && (
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  disabled
                                >
                                  Already {user.status}
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                        
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center py-3">
                              No users found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
                      onPageChange={handlePageChange}
                    />
                  </Tab.Pane>
                  
                  {/* Items Tab */}
                  <Tab.Pane eventKey="items">
                    <h2 className="mb-3">Manage Listings</h2>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            placeholder="Search by title, owner, or category"
                            value={searchTerm}
                            onChange={handleSearch}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Select value={filterStatus} onChange={handleStatusFilter}>
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </Form.Select>
                      </Col>
                    </Row>
                    
                    <Table responsive striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Owner</th>
                          <th>Status</th>
                          <th>Listed</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateData(filteredItems).map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.title}</td>
                            <td>{item.category}</td>
                            <td>{item.owner}</td>
                            <td>
                              {item.status === 'pending' && (
                                <Badge bg="warning">Pending</Badge>
                              )}
                              {item.status === 'approved' && (
                                <Badge bg="success">Approved</Badge>
                              )}
                              {item.status === 'rejected' && (
                                <Badge bg="danger">Rejected</Badge>
                              )}
                            </td>
                            <td>{new Date(item.listedAt).toLocaleDateString()}</td>
                            <td>
                              {item.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="success" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleItemAction(item.id, 'approve')}
                                  >
                                    <FaCheck /> Approve
                                  </Button>
                                  <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleItemAction(item.id, 'reject')}
                                  >
                                    <FaTimes /> Reject
                                  </Button>
                                </>
                              )}
                              {item.status !== 'pending' && (
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  disabled
                                >
                                  Already {item.status}
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                        
                        {filteredItems.length === 0 && (
                          <tr>
                            <td colSpan="7" className="text-center py-3">
                              No items found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
                      onPageChange={handlePageChange}
                    />
                  </Tab.Pane>
                  
                  {/* Orders Tab */}
                  <Tab.Pane eventKey="orders">
                    <h2 className="mb-3">Manage Orders</h2>
                    <p className="text-center py-5">
                      Order management will be implemented in the next phase.
                    </p>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminPanel;