import { useEffect, useState } from "react";
import Apis, { endpoints } from "../configs/Apis";
import { useParams } from "react-router-dom";
import { Alert, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import AudioPlayer from "./AudioPlayer";
import Comments from "./Comments";
import '../styles/RelatedArticles.css'
import RelatedArticles from "./RelatedArticles";

const ArticleDetail = () => {
    const { slug_id } = useParams();
    const [article, setArticle] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [slug, setSlug] = useState("");
    const [id, setId] = useState("");
    const [relatedArticles, setRelatedArticles] = useState([]);

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

    useEffect(() => {
        fetchArticleDetail();
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi slug_id thay đổi
    }, [slug_id]);

    useEffect(() => {
        fetchRelatedArticles();
    }, [slug, id]);

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
                            <p className="me-3"><strong>Tác giả:</strong> {article.author}</p>
                            <p><strong>Ngày đăng:</strong> {new Date(article.publishedDate).toLocaleDateString('vi-VN')}</p>
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
            </Container>
        )
    );
}

export default ArticleDetail;