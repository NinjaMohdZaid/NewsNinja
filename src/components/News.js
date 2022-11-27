import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component"

export class News extends Component {
    static defaultProps = {
        country:'in',
        pageSize:8
    }
    static propTypes={
        country : PropTypes.string,
        pagseSize : PropTypes.number,
        category : PropTypes.string,
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    constructor(props){
        super(props);
        this.state = {
            articles:[],
            loading:false,
            page:1,
            totalResults:0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsNinja`;
    }
    async updateNews(){
        this.props.setProgress(0);
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true});
        let data = await fetch(url);
        this.props.setProgress(30); 
        let parsedData = await data.json();
        this.props.setProgress(70); 
        this.setState({articles:parsedData.articles,
                       totalResults:parsedData.totalResults,
                       loading:false,
                       page:this.state.page
                    })
        this.props.setProgress(100); 
    }
    async componentDidMount(){
        //it will run after render
        this.updateNews();
    }
    fetchMoreData = async () => {
       this.setState({page:(this.state.page+1)});
       console.log(this.state.page);
       let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
       let data = await fetch(url);
       let parsedData = await data.json();
       this.setState({articles:this.state.articles.concat(parsedData.articles),
                      totalResults:parsedData.totalResults,
                   })
      };
  render() {
    return (
      <>
        <h1 className="text-center">NewsNinja - Top Headlines From {this.capitalizeFirstLetter(this.props.category)}</h1>
        {this.state.loading && <Spinner/>}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >
            <div className="container">
                <div className="row">
                    {!this.state.loading && this.state.articles.map((element)=>{
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
}

export default News
