import React, { Component } from 'react';
import './ImageGallery.css'
import Pagination from './Pagination';

class ImageGallery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formattedPicturesList: [],
            margin: 2,
            rowHeight: 200,
            amountPerPage: 7,
        };
        this.imageGalleryRef = null;
    }

    componentWillReceiveProps(props){
        this.formatImageList(props.pictures, 1);
    }

    componentDidMount(){
        this.formatImageList(this.props.pictures, 1);
    }

    /*componentWillReceiveProps(props){
        if(this.imageGalleryRef !== null){
            this.formatImageList(props.pictures, 1);
        }
    }*/

    formatImageList(pictures, pageNumber) {
        let rowHeight = this.state.rowHeight;
        let maxWidth = this.imageGalleryRef.getBoundingClientRect().width;
        let newArray = [];
        let newImageList = [];
        let totalWidth = 0;
        let counter = 0;
        let tryUntill = 0;
        let imageList = pictures;
        if (pageNumber*this.state.amountPerPage < imageList.length) {
            tryUntill = pageNumber*this.state.amountPerPage;
        }
        else tryUntill = imageList.length;
        for (let i=(pageNumber-1)*this.state.amountPerPage; i < tryUntill; i++) {
            totalWidth = totalWidth + (imageList[i].width * rowHeight) / imageList[i].height;
            counter = counter + 1;
            newArray.push(imageList[i]);
            if (totalWidth > maxWidth) {
                for (let j=0; j < newArray.length; j++){
                    newArray[j].flexBasis = (((newArray[j].width * rowHeight)/newArray[j].height) /totalWidth)*100*(1 - (this.state.margin*(counter-1))/maxWidth);
                }
                newImageList.push(newArray);
                counter=0;
                totalWidth = 0;
                newArray = []; 
            }
        }
        if (newArray.length > 0) {
            for (let j=0; j < newArray.length; j++){
                newArray[j].flexBasis = (((newArray[j].width * rowHeight)/newArray[j].height) /maxWidth)*100*(1 - (this.state.margin*(counter-1))/maxWidth);
            }
            newImageList.push(newArray);
        }
        this.setState(() => ({formattedPicturesList: newImageList}));
    }

    render() {
        const formattedList = this.state.formattedPicturesList;
        const amountOfPages = Math.ceil(this.props.pictures.length/this.state.amountPerPage);
        return (
            <div className="flex-wrap align-center justify-center">
                <ul ref={(el) => this.imageGalleryRef = el} style={{"width":"100%"}} className='image-gallery mt-2 mb-2'>
                    {formattedList.map((element, index) => 
                        <li 
                            key={index}
                            style={index < formattedList.length-1 ? {"marginBottom":this.state.margin+"px"}:{"marginBottom":"0px"}}
                        >
                                    {element.map((innerElement, index) => 
                                        <div 
                                            key={index} 
                                            style={index < element.length-1 ? {"marginRight": this.state.margin + "px","flexBasis": innerElement.flexBasis + "%"} : {"flexBasis": innerElement.flexBasis + "%"}}
                                            tabIndex="0"
                                        >
                                            <img src={innerElement.url} />
                                        </div>
                                    )}
                                </li>
                            )}
                </ul>
                <Pagination 
                    pageNumber={this.state.pageNumber}
                    amountOfPages={amountOfPages}
                    setPageNumber={(number) => {this.setState(() => ({pageNumber: number})); this.formatImageList(this.props.pictures, number);}}
                />
            </div>
        );
    }
}

export default ImageGallery;