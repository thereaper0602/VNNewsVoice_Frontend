import { useEffect, useState, useContext, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Apis, { endpoints } from '../../configs/Apis';
import { AppContext } from '../../contexts/AppContext';
import { SearchContext } from '../../contexts/SearchContext';

const Header = () => {
    const [categories, setCategories] = useState([]);
    const [generators, setGenerators] = useState([]);
    const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, selectedGenerator, setSelectedGenerator } = useContext(SearchContext);
    const { isAuthenticated, user, logout } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const loadCates = async () => {
        try {
            let res = await Apis.get(endpoints["categories"]);
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    }

    const loadGenerators = async () => {
        try{
            let res = await Apis.get(endpoints["generators"]);
            setGenerators(res.data);
        } catch (error) {
            console.error("Error fetching generators:", error);
            setGenerators([]);
        }
    }

    useEffect(() => {
        loadCates();
        loadGenerators();
    }, []);

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                        {/* <i className="bi bi-soundwave text-primary me-2"></i> */}
                        <img src='https://res.cloudinary.com/dg66aou8q/image/upload/v1756891972/trans_bg_logo_glvmry.png' style={{width : "80px", height:"50px"}}/>
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
                            <NavDropdown title="Nguồn" id='navbarScrollingDropdown'>
                                <NavDropdown.Item 
                                    key="all"
                                    onClick={() => {
                                        setSelectedGenerator('');
                                        navigate('/');
                                    }}
                                    active={selectedGenerator === ''}>
                                        Tất cả nguồn
                                </NavDropdown.Item>
                                {generators.map(g => (
                                    <NavDropdown.Item
                                        key={g.id}
                                        onClick = {() => {
                                            console.log("Generator selected:", g.id, typeof g.id);
                                            setSelectedGenerator(g.id);
                                            navigate('/');
                                        }}
                                        active={selectedGenerator === g.id}
                                    >
                                        {g.name}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
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
                                            console.log("Category selected:", c.id, typeof c.id);
                                            setSelectedCategory(c.id);
                                            navigate('/');
                                        }}
                                        active={selectedCategory === c.id}
                                    >
                                        {c.name}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>

                            {isAuthenticated ? (
                                <>
                                    <NavDropdown title={user?.username || "Tài khoản"} id="user-dropdown">
                                        <NavDropdown.Item as={Link} to="/profile">
                                            Thông tin cá nhân
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={logout}>
                                            Đăng xuất
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                    <Link className='nav-link' to="/register">
                                        Đăng ký tài khoản
                                    </Link>
                                    <Link className='nav-link' to="/login">
                                        Đăng nhập
                                    </Link>
                                </>
                            )}
                        </Nav>
                        {location.pathname !== '/search' && (
                            <Form className="d-flex" onSubmit={(e) => {
                                e.preventDefault();
                                if (searchTerm.trim()) {
                                    navigate('/search');
                                }
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
                                    <i className="bi bi-search me-1"></i>
                                </Button>
                            </Form>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;