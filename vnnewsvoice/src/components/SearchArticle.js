import { useContext, useEffect, useRef, useState } from "react";
import { SearchContext } from "../contexts/SearchContext";
import Apis, { endpoints } from "../configs/Apis";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Container, Form, Pagination, Row } from "react-bootstrap";
import MySpinner from "./layouts/MySpinner";


const SearchArticle = () => {
    const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, selectedGenerator, setSelectedGenerator } = useContext(SearchContext);
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [generators, setGenerators] = useState([]);
    const [pagination, setPagination] = useState({});
    const [page, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    const getArticles = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const params = { page };

            if (searchTerm){
                params.name = searchTerm;
                setCurrentSearchTerm(searchTerm);
                setSearchTerm('');
            }
            else if(currentSearchTerm){
                params.name = currentSearchTerm;
            }

            if (selectedCategory) {
                params.categoryId = selectedCategory;
            }

            if (selectedGenerator) {
                params.generatorId = selectedGenerator;
            }

            const response = await Apis.get(endpoints['articles'], { params });
            setArticles(response.data.articles);
            setPagination(response.data.pagination);
        }
        catch (error) {
            console.error("Error fetching articles:", error);
            setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.");
            setArticles([]);
            setPagination({});
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Khi searchTerm thay đổi (từ Header), gọi getArticles
        if (searchTerm) {
            setCurrentPage(1);
            getArticles(1);
        }
    }, [searchTerm]);

    const handleArticleClick = (article) => {
        if (article && article.id && article.slug) {
            navigate(`/${article.slug}_${article.id}`);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setCurrentSearchTerm(value);
    };


    const renderPagination = () => {
        if (!pagination || !pagination.totalPages) return null;

        let items = []
        for (let i = 1; i <= pagination.totalPages; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === page}
                    onClick={i === page ? null : () => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            )
        }

        return (
            <Pagination className="justify-content-center">
                <Pagination.Prev disabled={page === 1} onClick={() => handlePageChange(page - 1)} />
                {items}
                <Pagination.Next disabled={page === pagination.totalPages} onClick={() => handlePageChange(page + 1)} />
            </Pagination>
        );
    }

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await Apis.get(endpoints["categories"]);
                setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            }
        };

        const loadGenerators = async () => {
            try {
                const res = await Apis.get(endpoints["generators"]);
                setGenerators(res.data);
            } catch (error) {
                console.error("Error fetching generators:", error);
                setGenerators([]);
            }
        };

        loadCategories();
        loadGenerators();
    }, []);

    useEffect(() => {
        if (searchTerm || selectedCategory || selectedGenerator) {
            setCurrentPage(1);
            getArticles(page);
        }
        else {
            getArticles(page);
        }
    }, [page, selectedCategory, selectedGenerator]);

    const handleSearchClick = () => {
        if (currentSearchTerm) {
            setCurrentPage(1);
            getArticles(page);
        }
    }




    return (
        <Container className='py-4'>
            <h2 className="mb-4">Kết quả tìm kiếm</h2>

            <Form className="d-flex" onSubmit={(e) => {
                e.preventDefault();
                if(currentSearchTerm.trim()){
                    setCurrentPage(1);
                    getArticles(1);
                }
            }}>
                <Form.Control
                    type="search"
                    placeholder="Tìm kiếm bài viết..."
                    className="me-2"
                    aria-label="Search"
                    value={currentSearchTerm}
                    onChange={(e) => setCurrentSearchTerm(e.target.value)}
                />
                <Button variant="outline-success" type="submit" onClick={handleSearchClick}>
                    <i className="bi bi-search me-1"></i>
                </Button>
            </Form>

            <div className="mb-4">
                <Form.Group className="mb-4">

                    <Form.Label>Chọn nguồn</Form.Label>
                    <Form.Select onChange={(e) => setSelectedGenerator(e.target.value)}>

                        <option value="">Tất cả nguồn</option>
                        {generators.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Chọn danh mục</Form.Label>
                    <Form.Select onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">Tất cả danh mục</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {error && (
                    <Alert variant="danger" className="mt-4">
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <MySpinner />
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
                                            {article.author && (
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    By {article.author}
                                                </Card.Subtitle>
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
                                                    {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : 'Unknown date'}
                                                </small>
                                            </div>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center">
                                <p>Không có bài viết nào phù hợp với tìm kiếm của bạn</p>
                            </Col>
                        )}
                    </Row>
                )}

                {renderPagination()}
            </div>
        </Container>
    );
}

export default SearchArticle;
