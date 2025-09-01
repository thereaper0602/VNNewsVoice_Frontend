import { useState, useEffect, useContext, useRef } from 'react';
import { Button, Form, Card, Spinner } from 'react-bootstrap';
import { FaThumbsUp } from 'react-icons/fa';
import Apis, { authApis, endpoints } from '../configs/Apis';
import { AppContext } from '../contexts/AppContext';
import ModalLogin from './ModalLogin';

const Comments = ({ slug, id }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const {isAuthenticated, login, loginWithGoogle} = useContext(AppContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const commentInputRef = useRef(null);

    const fetchComments = async (page = 1) => {
        if (!slug || !id) return;

        setLoading(true);
        try {
            const response = await Apis.get(endpoints.comments(slug, id), {
                params: { page }
            });
            
            if (response.data) {
                if (page === 1) {
                    setComments(response.data.comments || []);
                } else {
                    setComments(prev => [...prev, ...(response.data.comments || [])]);
                }
                setPagination(response.data.pagination || {});
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
            setError("Không thể tải bình luận. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(1);
    }, [slug, id]);

    const handleModalClose = () => {
        setShowLoginModal(false);
        if(commentInputRef.current){
            commentInputRef.current.blur();
        }
    }

    const handleLoadMore = () => {
        if (pagination && pagination.currentPage < pagination.totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchComments(nextPage);
        }
    };

    const handleLike = (commentId) => {
        if(!isAuthenticated){
            setShowLoginModal(true);
            return;
        }

        // Tạm thời chỉ cập nhật UI, không gọi API
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    likeCount: comment.likeCount + 1,
                    liked: true
                };
            }
            return comment;
        }));
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if(!isAuthenticated){
            setShowLoginModal(true);
            return;
        }

        if(!commentText.trim()) return;

        try{
            setSubmitting(true);
            const commentData = {
                content : commentText.trim()
            };

            const response = await authApis().post(
                endpoints.postComment(slug, id),
                commentData
            );
            if(response.data){
                setComments([response.data, ...comments]);
                setCommentText('');
            }
            if(pagination){
                setPagination({
                    ...pagination,
                    totalItems: (pagination.totalItems || 0) + 1
                })
            }
        }
        catch(err){
            console.error("Error submitting comment:", err);
            setError("Không thể gửi bình luận. Vui lòng thử lại sau.");
        }
        finally{
            setSubmitting(false);
        }
    };

    return (
        <div className="comments-section mt-5">
            <h3 className="mb-4">Ý kiến ({pagination.totalItems || 0})</h3>
            
            {/* Form nhập bình luận */}
            <Card className="mb-4">
                <Card.Body>
                    <Form onSubmit={handleSubmitComment}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Chia sẻ ý kiến của bạn"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                // onFocus={handleCommentInputFocus}
                                ref={commentInputRef}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={submitting || !commentText.trim()}>
                                {submitting ? 
                                (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                        Đang gửi...
                                </> ) : ( "Gửi bình luận" )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {/* Tab điều hướng */}
            <div className="comment-tabs mb-4">
                <Button variant="link" className="text-decoration-none fw-bold text-dark px-0 me-4">
                    Quan tâm nhất
                </Button>
                <Button variant="link" className="text-decoration-none text-secondary px-0">
                    Mới nhất
                </Button>
                <hr className="mt-2" />
            </div>

            {/* Danh sách bình luận */}
            {error ? (
                <div className="alert alert-danger">{error}</div>
            ) : comments.length > 0 ? (
                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment.id} className="comment-item mb-4">
                            <div className="d-flex">
                                <div className="comment-avatar me-3">
                                    <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        {comment.readerName?.charAt(0) || 'U'}
                                    </div>
                                </div>
                                <div className="comment-content flex-grow-1">
                                    <Card>
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6 className="mb-0">{comment.readerName}</h6>
                                                <small className="text-muted">
                                                    {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                                                </small>
                                            </div>
                                            <p>{comment.content}</p>
                                            <div className="d-flex align-items-center">
                                                <Button 
                                                    variant="link" 
                                                    className={`d-flex align-items-center p-0 ${comment.liked ? 'text-primary' : 'text-secondary'}`}
                                                    onClick={() => handleLike(comment.id)}
                                                >
                                                    <FaThumbsUp className="me-1" />
                                                    <span>Thích</span>
                                                </Button>
                                                <span className="ms-2 text-muted">{comment.likeCount || 0}</span>
                                                <Button variant="link" className="text-secondary ms-3 p-0">
                                                    Trả lời
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Nút tải thêm bình luận */}
                    {pagination && pagination.currentPage < pagination.totalPages && (
                        <div className="text-center mt-4">
                            <Button 
                                variant="outline-primary" 
                                onClick={handleLoadMore}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Đang tải...
                                    </>
                                ) : (
                                    'Xem thêm bình luận'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-5">
                    <p className="text-muted">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                </div>
            )}
            <ModalLogin show={showLoginModal} onHide={handleModalClose} />
        </div>
    );
};

export default Comments;