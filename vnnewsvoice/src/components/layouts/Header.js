import { useEffect, useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import Apis, { endpoints } from '../../configs/Apis';
import { SearchContext } from '../../App';

const Header = () => {
    const [categories, setCategories] = useState([]);
    const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useContext(SearchContext);
    const navigate = useNavigate();

    const loadCates = async () => {
        try {
            let res = await Apis.get(endpoints["categories"]);
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    }

    useEffect(() => {
        loadCates();
    }, []);

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                        <i className="bi bi-soundwave text-primary me-2"></i>
                        VN News Voice
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Link to="/" className='nav-link'>Trang chủ</Link>
                            <NavDropdown title="Danh mục" id="navbarScrollingDropdown">
                                <NavDropdown.Item 
                                    key="all" 
                                    onClick={() => {
                                        setSelectedCategory('');
                                        navigate('/');
                                    }}
                                    active={selectedCategory === ''}
                                >
                                    Tất cả danh mục
                                </NavDropdown.Item>
                                {categories.map(c => (
                                    <NavDropdown.Item 
                                        key={c.id} 
                                        onClick={() => {
                                            setSelectedCategory(c.id);
                                            navigate('/');
                                        }}
                                        active={selectedCategory === c.id}
                                    >
                                        {c.name}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                            <Nav.Link href="#" disabled>
                                Link
                            </Nav.Link>
                        </Nav>
                        <Form className="d-flex" onSubmit={(e) => {
                            e.preventDefault();
                            navigate('/');
                        }}>
                            <Form.Control
                                type="search"
                                placeholder="Tìm kiếm bài viết..."
                                className="me-2"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="outline-success" type="submit">
                                <i className="bi bi-search me-1"></i> Tìm kiếm
                            </Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;
