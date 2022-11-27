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
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0be15b2549ef41fd832ee8dfc2479d02&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true});
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({articles:parsedData.articles,
                       totalResults:parsedData.totalResults,
                       loading:false,
                    })
    }
    async componentDidMount(){
        //it will run after render
        this.updateNews();
    }
    //  handlePreviousClick = async ()=>{
    //     await this.setState({page:this.state.page-1});
    //     this.updateNews();
    // }
    //  handleNextClick = async () =>{
    //     await this.setState({page:this.state.page+1});
    //     this.updateNews();
    // }
    fetchMoreData = async () => {
       this.setState({page:this.state.page+1});
       let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0be15b2549ef41fd832ee8dfc2479d02&page=${this.state.page}&pageSize=${this.props.pageSize}`;
       let data = await fetch(url);
       let parsedData = await data.json();
       this.setState({articles:this.state.articles.concat(parsedData.articles),
                      totalResults:parsedData.totalResults,
                    //   loading:false,
                   })
      };
  render() {
    return (
      <>
        <h1 className="text-center">NewsNinja - Top Headlines From {this.capitalizeFirstLetter(this.props.category)}</h1>
        {this.state.loading && <Spinner/>}

        {/* <div className="row">
            {!this.state.loading && this.state.articles.map((element)=>{
                return <div key={element.url} className="col-md-4">
                <NewsItem title={element.title?element.title.slice(0,45):""} description={element.description?element.description.slice(0,88):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
            </div>
            })}
            
        </div> */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >
            {/* {console.log(this.state.articles.length, this.state.totalResults)} */}
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
        {/* <div className="container d-flex justify-content-between">
          <button disabled={this.state.page===1} type="button" className="btn btn-dark" onClick={this.handlePreviousClick}>&larr; Previous</button>
          <button disabled={this.state.page +1 >Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div> */}
      </>
    )
  }
}

export default News
