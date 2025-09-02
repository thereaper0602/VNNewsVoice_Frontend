import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";
import { Container, Pagination, Row, Col, Card, Badge } from "react-bootstrap";

const CommentedArticles = () => {
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const nav = useNavigate();

  const fetchComments = async (page = 1) => {
    setLoading(true);
    try {
      const response = await authApis().get(endpoints.personalComment, {
        params: { page: page }
      });
      
      setComments(response.data.comments);
      setPagination(response.data.pagination);
    } catch (err) {
      // Chuyển đổi đối tượng lỗi thành chuỗi
      setError("Không thể tải danh sách bài viết đã bình luận. Vui lòng thử lại sau.");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleArticleClick = (article_id, article_slug) => {
    if (article_id && article_slug) {
      nav(`/${article_slug}_${article_id}`);
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  const renderPagination = () => {
    if(!pagination || !pagination.totalPages) return null;

    let items = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {items}
        <Pagination.Next
          disabled={currentPage === pagination.totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </Pagination>
    );
  }

  return (
    <div className="general-info-section">
      <h2>Bài viết đã bình luận</h2>
      
      {error && (
        <div className="alert alert-danger text-center mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang tải bài viết...</p>
        </div>
      ) : (
        <>
          {comments && comments.length > 0 ? (
            <Row>
              {comments.map((comment) => (
                <Col md={12} key={comment.id} className="mb-3">
                  <Card className="shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Card.Title 
                            className="mb-2 article-title" 
                            style={{cursor: 'pointer'}}
                            onClick={() => handleArticleClick(comment.articleId, comment.articleSlug)}
                          >
                            {comment.articleTitle}
                          </Card.Title>
                          <Card.Subtitle className="mb-3 text-muted">
                            <small>Bình luận vào {formatDate(comment.createdAt)}</small>
                          </Card.Subtitle>
                        </div>
                        <Badge bg="info" className="ms-2">
                          <i className="bi bi-hand-thumbs-up me-1"></i>
                          {comment.likeCount}
                        </Badge>
                      </div>
                      <Card.Text className="border-top pt-2">
                        <i className="bi bi-chat-quote me-2"></i>
                        {comment.content}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-chat-square-text fs-1 text-muted"></i>
              <p className="mt-3">Bạn chưa bình luận bài viết nào.</p>
            </div>
          )}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default CommentedArticles;