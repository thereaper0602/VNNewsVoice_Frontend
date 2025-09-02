import { useContext, useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../configs/Apis";
import { useParams } from "react-router-dom";
import { Alert, Button, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import AudioPlayer from "./AudioPlayer";
import Comments from "./Comments";
import '../styles/RelatedArticles.css'
import RelatedArticles from "./RelatedArticles";
import { AppContext } from "../contexts/AppContext";
import ModalLogin from "./ModalLogin";

const ArticleDetail = () => {
    const { slug_id } = useParams();
    const [article, setArticle] = useState(null);
    const [liked, setIsLiked] = useState(false);
    const [totalLike, setTotalLike] = useState(0);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [slug, setSlug] = useState("");
    const [id, setId] = useState("");
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const {isAuthenticated, login, loginWithGoogle} = useContext(AppContext);

    const fetchTotalArticleLike = async (slug, id) => {
        try{
            const response = await Apis.get(endpoints.totalArticleLike(slug, id));
            if(response.data){
                setTotalLike(response.data.totalLike);
            }
        } catch (err){
            console.log(err)
            setError("Lỗi khi lấy tổng số lượt thích bài viết.");
        }
    }

    const fetchArticleDetail = async () => {
        if (!slug_id) {
            return;
        }

        try {
            const parts = slug_id.split('_');
            setSlug(parts[0]);
            setId(parts[1]);
            const response = await Apis.get(endpoints.articleDetail(parts[0], parts[1]));
            if (response.data) {
                setArticle(response.data.article);
                setBlocks(response.data.blocks || []);
            }
        } catch (err) {
            console.error("Error fetching article details:", err);
            setError("Không thể tải thông tin bài viết. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const checkIsLikedArticle = async (slug, id) => {
        if(!isAuthenticated || !slug || !id) {
            return;
        }

        try{
            const response = await authApis().get(endpoints.isLikedArticle(slug, id));
            if(response.data.isLiked === true){
                setIsLiked(response.data.isLiked);
            }
            else {
                setIsLiked(false);
            }
        } catch(err){
            console.error("Error checking if article is liked:", err);
            setError("Lỗi khi kiểm tra trạng thái thích bài viết.");
        }

    }

    const fetchRelatedArticles = async () => {
        if (!slug || !id) return;

        try {
            const response = await Apis.get(endpoints.relatedArticles(slug, id, 10));
            if (response.data && response.data.relatedArticles) {
                setRelatedArticles(response.data.relatedArticles);
            }
        }
        catch (err) {
            console.error("Error fetching related articles:", err);
        }
    };

    const handleLikeArticle = async () => {
        if(!isAuthenticated){
            setShowLoginModal(true);
            return;
        }

        try{
            if(liked) {
                const response = await authApis().delete(endpoints.deleteArticleLike(slug, id));
                if(response.status === 204){
                    setTotalLike(prev => prev - 1);
                    setIsLiked(false);
                }
            }
            else{
                const response = await authApis().post(endpoints.addArticleLike(slug, id));
                if(response.status === 201){
                    setTotalLike(prev => prev + 1);
                    setIsLiked(true);
                }
            }
        } catch (err) {
            console.error("Error liking article:", err);
        }
    };

    useEffect(() => {
        fetchArticleDetail();
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi slug_id thay đổi
    }, [slug_id]);

    useEffect(() => {
        fetchRelatedArticles();
    }, [slug, id]);

    useEffect(() => {
        if(slug && id) {
            fetchTotalArticleLike(slug, id);
            checkIsLikedArticle(slug, id);
        }
    },[slug, id]);

    return (
        loading ? (
            <Container className="d-flex justify-content-center my-5">
                <Spinner animation="border" />
            </Container>
        ) : error ? (
            <Container className="my-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        ) : !article ? (
            <Container className="my-5">
                <Alert variant="info">Không tìm thấy bài viết.</Alert>
            </Container>
        ) : (
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h1 className="mb-4">{article.title}</h1>
                        <div className="d-flex mb-3">
                            <p className="me-3"><strong>Nguồn: </strong>Báo {article.generatorIdName}</p>
                            <p><strong>Ngày xuất bản:</strong> {new Date(article.publishedDate).toLocaleDateString('vi-VN')}</p>
                            <p className="ms-3"><strong>Lượt thích: </strong> {totalLike}</p>
                            <Button className = "ms-3" variant={liked ? 'primary' : 'outline-primary'} onClick={handleLikeArticle}>{liked ? 'Đã thích' : 'Thích'}</Button>
                        </div>

                        <div className="d-flex mb-3">
                            <p className="me-3"><strong>Thể loại: </strong> {article.categoryIdName}</p>
                            <p><strong>Bài viết gốc: </strong> <a href={article.originalUrl} target="_blank" rel="noopener noreferrer">Xem tại đây</a></p>
                        </div>

                        {article.audioUrl && (
                            <AudioPlayer
                                audioUrl={article.audioUrl}
                                title={`Nghe: ${article.title}`}
                            />
                        )}

                        {article.topImageUrl && (
                            <div className="mb-4">
                                <Image src={article.topImageUrl} fluid className="w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} />
                            </div>
                        )}

                        <div className="article-summary mb-4">
                            <p className="lead">{article.summary}</p>
                        </div>

                        <div className="article-content">
                            {blocks.map((block, index) => {
                                switch (block.type) {
                                    case 'text':
                                        return <p key={index}>{block.content}</p>;
                                    case 'paragraph':
                                        return <p key={index}>{block.content}</p>;
                                    case 'heading':
                                        return block.tag === 'h2' ?
                                            <h2 key={index}>{block.text}</h2> :
                                            <h3 key={index}>{block.text}</h3>;
                                    case 'image':
                                        return (
                                            <div key={index} className="my-4">
                                                <Image src={block.src} fluid />
                                                {block.caption && <p className="text-center text-muted mt-2">{block.caption}</p>}
                                            </div>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </div>

                        <Comments slug={slug} id={id} />
                        <hr />
                        <RelatedArticles articles={relatedArticles} />
                    </Col>
                </Row>
                <ModalLogin show={showLoginModal} onHide={() => setShowLoginModal(false)} />
            </Container>
        )
    );
}

export default ArticleDetail;