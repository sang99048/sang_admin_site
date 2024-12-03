import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", price: "", imageUrl: "" });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://flutter-appp.onrender.com/api/items"
        );
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        setError("Không thể lấy dữ liệu từ API.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Thêm sản phẩm mới
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://flutter-appp.onrender.com/api/items/add",
        newItem
      );
      setItems([...items, response.data.newProduct]);
      setNewItem({ name: "", price: "", imageUrl: "" });
    } catch (error) {
      setError("Lỗi khi thêm sản phẩm.");
    }
  };

  // Cập nhật sản phẩm
  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://flutter-appp.onrender.com/api/items/update/${editingItem._id}`,
        editingItem
      );
      const updatedItems = items.map((item) =>
        item._id === editingItem._id ? response.data.updatedProduct : item
      );
      setItems(updatedItems);
      setEditingItem(null);
    } catch (error) {
      setError("Lỗi khi cập nhật sản phẩm.");
    }
  };

  // Xóa sản phẩm
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(
        `https://flutter-appp.onrender.com/api/items/delete/${id}`
      );
      const filteredItems = items.filter((item) => item._id !== id);
      setItems(filteredItems);
    } catch (error) {
      setError("Lỗi khi xóa sản phẩm.");
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container>
      <h2 className="my-4">Danh sách sản phẩm</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {items.map((item) => (
          <Col md={4} key={item._id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={item.imageUrl} alt={item.name} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.price} VND</Card.Text>
                <Button variant="primary" onClick={() => setEditingItem(item)}>
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteItem(item._id)}
                  className="ml-2"
                >
                  Xóa
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Form thêm sản phẩm */}
      <h3 className="my-4">Thêm sản phẩm mới</h3>
      <Form onSubmit={handleAddItem}>
        <Form.Group controlId="formName">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên sản phẩm"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formPrice">
          <Form.Label>Giá sản phẩm (VND)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Nhập giá sản phẩm"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formImageUrl">
          <Form.Label>URL ảnh sản phẩm</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập URL ảnh sản phẩm"
            value={newItem.imageUrl}
            onChange={(e) =>
              setNewItem({ ...newItem, imageUrl: e.target.value })
            }
          />
        </Form.Group>

        <Button variant="success" type="submit">
          Thêm sản phẩm
        </Button>
      </Form>

      {/* Form sửa sản phẩm */}
      {editingItem && (
        <div className="my-4">
          <h3>Sửa sản phẩm</h3>
          <Form onSubmit={handleEditItem}>
            <Form.Group controlId="formEditName">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên sản phẩm"
                value={editingItem.name}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formEditPrice">
              <Form.Label>Giá sản phẩm (VND)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập giá sản phẩm"
                value={editingItem.price}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, price: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formEditImageUrl">
              <Form.Label>URL ảnh sản phẩm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập URL ảnh sản phẩm"
                value={editingItem.imageUrl}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, imageUrl: e.target.value })
                }
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Cập nhật sản phẩm
            </Button>
            <Button
              variant="secondary"
              onClick={() => setEditingItem(null)}
              className="ml-2"
            >
              Hủy
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
};

export default ItemList;
