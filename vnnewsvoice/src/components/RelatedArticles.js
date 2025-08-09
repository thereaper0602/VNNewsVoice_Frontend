import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/RelatedArticles.css'

const RelatedArticles = ({articles}) => {
    if(!articles || articles.length === 0){
        return null;
    }

    return (
        <div className='related-articles mt-4'>
            <h3 className='mb-3'>Bài viết liên quan</h3>

            <Row xs={1} sm={2} md={3} className='g-3'>
                {articles.map((article) => (
                    <Col key={article.id}>
                        <Card className='related-article-card h-100'>
                            {article.topImageUrl && (
                                <Card.Img 
                                    variant='top'
                                    src={article.topImageUrl} style={{height:'120px', objectFit : 'cover'}} /> )}
                                <Card.Body>
                                    <Card.Title className="fs-6">
                                        <Link
                                            to={`/${article.slug}_${article.id}`} className='related-article-link'>
                                                {article.title}
                                        </Link>
                                    </Card.Title>
                                    <Card.Text className='text-muted small'>
                                        {new Date(article.publishedDate).toLocaleDateString('vi-VN')}
                                    </Card.Text>
                                </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default RelatedArticles;