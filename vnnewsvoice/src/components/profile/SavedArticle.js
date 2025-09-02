import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Card, Col, Pagination, Row } from "react-bootstrap";

const SavedArticles = () => {
  const [likedArticles, setLikedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const nav = useNavigate();

  const fetchLikedArticles = async (page = 1) => {
    setLoading(true);
    try {
      const response = await authApis().get(endpoints.personalArticleLike, {
        params: { page: page < 1 ? 1 : page }
      });
      setLikedArticles(response.data.articleLikes);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err);
    }
    finally {
      setLoading(false);
    }
  }

  const handleArticleClick = (articleId, articleSlug) => {
    if (articleId && articleSlug) {
      nav(`/${articleSlug}_${articleId}`);
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("vi-VN", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
    catch (err) {
      setError(err);
      return dateString;
    }
  };

  const renderPagination = () => {
    if (!pagination || !pagination.totalPages) {
      return null;
    }

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
      )
    }

    return (
      <Pagination>
        <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />
        {items}
        <Pagination.Next disabled={currentPage === pagination.totalPages} onClick={() => handlePageChange(currentPage + 1)} />
      </Pagination>
    );
  }

  useEffect(() => {
    fetchLikedArticles(currentPage);
  }, [currentPage]);

  return (
    <div className="general-info-section">
      <h2>Bài viết đã lưu</h2>
      {error && (
        <div className="alert alert-danger text-center mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <>
          {likedArticles && likedArticles.length > 0 ? (
            <Row>
              {likedArticles.map((item) => (
                <Col md={12} key={item.id} className="mb-3">
                  <Card className="shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Card.Title
                            className="mb-2 article-title"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleArticleClick(item.articleIdId, item.articleIdSlug)}>
                            {item.articleIdTitle}
                          </Card.Title>
                          <Card.Subtitle className="mb-3 text-muted">
                            <small>{formatDate(item.createdAt)}</small>
                          </Card.Subtitle>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-chat-square-text fs-1 text-muted"></i>
              <p className="mt-3">Chưa có bài viết nào được lưu.</p>
            </div>
          )}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default SavedArticles;