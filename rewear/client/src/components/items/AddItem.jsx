import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FaUpload, FaTrash } from 'react-icons/fa';
// Removed the unused import

// Validation schema
const ItemSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .required('Description is required'),
  category: Yup.string()
    .required('Category is required'),
  size: Yup.string()
    .required('Size is required'),
  condition: Yup.string()
    .required('Condition is required'),
  tags: Yup.string()
});

const AddItem = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('You can only upload up to 5 images');
      return;
    }
    
    setImages([...images, ...files]);
    
    // Create previews
    const newPreviews = [...previews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (images.length === 0) {
        setError('Please upload at least one image');
        setSubmitting(false);
        return;
      }
      
      setError(null);
      
      // Prepare form data for upload
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('size', values.size);
      formData.append('condition', values.condition);
      formData.append('tags', values.tags);
      
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
      
      // Submit the form
      console.log('Submitting item with values:', values);
      console.log('Images to upload:', images);
      
      // In a real app, you would call the API here
      // Using formData with an actual API call
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to the item page or dashboard
      navigate('/dashboard', { 
        state: { 
          success: true, 
          message: 'Item added successfully! It will be visible once approved by an admin.' 
        } 
      });
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.response?.data?.message || 'Failed to add item. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <h2 className="mb-4">Add New Item</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Formik
          initialValues={{
            title: '',
            description: '',
            category: '',
            size: '',
            condition: 'Good',
            tags: ''
          }}
          validationSchema={ItemSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Images</Form.Label>
                <div className="image-upload-container mb-3">
                  <Row>
                    {previews.map((preview, index) => (
                      <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                        <div className="position-relative">
                          <img 
                            src={preview} 
                            alt={`Preview ${index}`}
                            className="img-thumbnail"
                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => removeImage(index)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </Col>
                    ))}
                    
                    {previews.length < 5 && (
                      <Col xs={6} md={4} lg={3} className="mb-3">
                        <div 
                          className="upload-placeholder"
                          style={{ 
                            width: '100%',
                            height: '150px',
                            border: '2px dashed #ced4da',
                            borderRadius: '0.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            backgroundColor: '#f8f9fa'
                          }}
                          onClick={() => document.getElementById('imageUpload').click()}
                        >
                          <FaUpload size={30} className="text-muted mb-2" />
                          <p className="text-muted mb-0">Add Image</p>
                        </div>
                        <Form.Control
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                      </Col>
                    )}
                  </Row>
                </div>
                <Form.Text className="text-muted">
                  Upload up to 5 images. First image will be the main display image.
                </Form.Text>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.title && errors.title}
                      placeholder="Enter a descriptive title"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.category && errors.category}
                    >
                      <option value="">Select category</option>
                      <option value="shirts">Shirts</option>
                      <option value="tshirts">T-Shirts</option>
                      <option value="pants">Pants</option>
                      <option value="jeans">Jeans</option>
                      <option value="dresses">Dresses</option>
                      <option value="skirts">Skirts</option>
                      <option value="jackets">Jackets</option>
                      <option value="hoodies">Hoodies</option>
                      <option value="sweaters">Sweaters</option>
                      <option value="shoes">Shoes</option>
                      <option value="accessories">Accessories</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.category}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Size</Form.Label>
                    <Form.Select
                      name="size"
                      value={values.size}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.size && errors.size}
                    >
                      <option value="">Select size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="XXXL">XXXL</option>
                      <option value="other">Other (specify in description)</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.size}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Condition</Form.Label>
                    <Form.Select
                      name="condition"
                      value={values.condition}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.condition && errors.condition}
                    >
                      <option value="New">New (with tags)</option>
                      <option value="Like New">Like New (no tags)</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.condition}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.description && errors.description}
                  placeholder="Provide detailed description including brand, material, measurements, etc."
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Tags (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  value={values.tags}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.tags && errors.tags}
                  placeholder="e.g., vintage, summer, casual"
                />
                <Form.Text className="text-muted">
                  Add relevant tags to help others find your item.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.tags}
                </Form.Control.Feedback>
              </Form.Group>
              
              <div className="d-grid">
                <Button 
                  type="submit" 
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Submitting...</span>
                    </>
                  ) : (
                    'Submit Listing'
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default AddItem;