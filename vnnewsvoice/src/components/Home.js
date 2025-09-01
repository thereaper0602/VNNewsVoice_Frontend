import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap';
import Apis, { endpoints } from '../configs/Apis';

import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../contexts/SearchContext';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Sử dụng Context API để lấy trạng thái tìm kiếm và danh mục
    const { searchTerm, selectedCategory, selectedGenerator } = useContext(SearchContext);

    const getArticles = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const params = { page };

            if (searchTerm) {
                params.name = searchTerm;
            }

            if (selectedCategory) {
                params.categoryId = selectedCategory;
                console.log("Selected category:", selectedCategory);
            }

            if (selectedGenerator) {
                params.generatorId = selectedGenerator;
                console.log("Selected generator:", selectedGenerator);
            }

            const response = await Apis.get(endpoints['articles'], { params });
            setArticles(response.data.articles);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Error fetching articles:", error);
            setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.");
            setArticles([]);
            setPagination({});
        } finally {
            setLoading(false);
        }
    }

    const handleArticleClick = (article) => {
        if (article && article.id && article.slug) {
            navigate(`/${article.slug}_${article.id}`);
        }
    };

    // const getCategories = async () => {
    //     try {
    //         const response = await Apis.get(endpoints['categories']);
    //         setCategories(response.data);
    //     } catch (error) {
    //         console.error("Error fetching categories:", error);
    //         // Không hiển thị lỗi cho danh mục, chỉ để trống
    //         setCategories([]);
    //     }
    // }

    useEffect(() => {
        // Reset về trang 1 khi searchTerm hoặc selectedCategory thay đổi
        if (searchTerm || selectedCategory || selectedGenerator) {
            setCurrentPage(1);
            getArticles(1);
        } else {
            getArticles(currentPage);
        }
        // getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, selectedCategory, selectedGenerator]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // Không cần các hàm xử lý tìm kiếm và thay đổi danh mục nữa vì đã được xử lý ở Header

    const renderPagination = () => {
        if (!pagination || !pagination.totalPages) return null;

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
        <Container className="py-4">

            {/* Phần tìm kiếm và lọc danh mục đã được chuyển sang Header */}

            {error && (
                <div className="alert alert-danger text-center mb-4" role="alert">
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
                <Row xs={1} md={2} lg={3} className="g-4">
                    {articles && articles.length > 0 ? (
                        articles.map((article, index) => (
                            <Col key={article.id || index}>
                                <Card className="h-100 shadow-sm"
                                    onClick={() => handleArticleClick(article)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: '180px' }}>
                                        {article.topImageUrl ? (
                                            <img
                                                src={article.topImageUrl}
                                                alt={article.title}
                                                className="img-fluid"
                                                style={{ maxHeight: '180px', objectFit: 'cover', width: '100%' }}
                                            />
                                        ) : (
                                            <i className="bi bi-newspaper text-primary" style={{ fontSize: '3rem' }}></i>
                                        )}
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{article.title}</Card.Title>
                                        {article.generatorIdName && (
                                            <>
                                                <img src={article.generatorIdLogoUrl} className="me-2" style={{ width: '60px', height: '30px' }} />
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    Nguồn :Báo {article.generatorIdName}
                                                </Card.Subtitle>
                                            </>
                                        )}
                                        <Card.Text>
                                            {article.summary ? (
                                                article.summary.length > 100 ?
                                                    `${article.summary.substring(0, 100)}...` :
                                                    article.summary
                                            ) : 'No summary available'}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="bg-white">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">
                                                Ngày xuất bản : {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : 'Unknown date'}
                                            </small>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center">
                            <p>Không có bài viết nào</p>
                        </Col>
                    )}
                </Row>
            )}

            {renderPagination()}
        </Container>
    );
}

export default Home;