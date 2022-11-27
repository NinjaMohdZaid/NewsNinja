import React, { useEffect,useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component"

const News = (props) => {
    const [articles,setArticles] = useState([]);
    const [loading,setLoading] = useState(true);
    const [page,setPage] = useState(1);
    const [totalResults,setTotalResults] = useState(0);
    // document.title = `${capitalizeFirstLetter(props.category)} - NewsNinja`;
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const updateNews = async () => {
        props.setProgress(0);
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30); 
        let parsedData = await data.json();
        props.setProgress(70); 
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);
        setPage(page);
        props.setProgress(100); 
    }
    useEffect(() => {
        updateNews();
      });
    const fetchMoreData = async () => {
       setPage(page+1);
       let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
       let data = await fetch(url);
       let parsedData = await data.json();
       setArticles(articles.concat(parsedData.articles));
       setTotalResults(parsedData.totalResults);
      };
    return (
      <>
        <h1 className="text-center">NewsNinja - Top Headlines From {capitalizeFirstLetter(props.category)}</h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >
            <div className="container">
                <div className="row">
                    {loading && articles.map((element)=>{
                        return <div key={element.url} className="col-md-4">
                        <NewsItem title={element.title?element.title.slice(0,45):""} description={element.description?element.description.slice(0,88):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                        
                    </div>
                    })}
                    
                </div>
            </div>
        </InfiniteScroll>
      </>
    )
}
News.defaultProps = {
    country:'in',
    pageSize:8
}
News.propTypes={
    country : PropTypes.string,
    pagseSize : PropTypes.number,
    category : PropTypes.string,
}
export default News
