import React, { Component } from "react";
import "./Pagination.css";
import ArrowUpSVG from "../svg/ArrowUpSVG";

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.pagination = [];
  }

  componentDidMount() {
    this.updatePagination(this.props);
  }

  componentWillReceiveProps(props) {
    this.updatePagination(props);
  }

  updatePagination(props) {
    this.pagination = [];
    if (props.amountOfPages < 8) {
      for (let i = 1; i < props.amountOfPages + 1; i++) {
        this.pagination.push(i);
      }
    } else {
      if (props.pageNumber < 5) {
        for (let i = 1; i < 6; i++) {
          this.pagination.push(i);
        }
        this.pagination.push(0);
        this.pagination.push(props.amountOfPages);
      } else {
        if (props.pageNumber < props.amountOfPages - 3) {
          this.pagination.push(1);
          this.pagination.push(0);
          this.pagination.push(props.pageNumber - 1);
          this.pagination.push(props.pageNumber);
          this.pagination.push(props.pageNumber + 1);
          this.pagination.push(0);
          this.pagination.push(props.amountOfPages);
        } else {
          this.pagination.push(1);
          this.pagination.push(0);
          for (
            let i = props.amountOfPages - 4;
            i < props.amountOfPages + 1;
            i++
          ) {
            this.pagination.push(i);
          }
        }
      }
    }
  }

  render() {
    return (
      <div
        style={
          this.props.pageNumber === 1 ||
          this.props.pageNumber === this.props.amountOfPages
            ? this.props.pageNumber === 1
              ? { marginLeft: "40px" }
              : { marginRight: "40px" }
            : { marginLeft: "0px", marginRight: "0px" }
        }
      >
        {this.props.amountOfPages > 1 && (
          <ul className="flex-nowrap pagination">
            {this.props.pageNumber > 1 && (
              <li>
                <button
                  onClick={() =>
                    this.props.setPageNumber(this.props.pageNumber - 1)
                  }
                >
                  <ArrowUpSVG />
                </button>
              </li>
            )}
            {this.pagination.map((element, index) => (
              <li key={index} className="buttonlike-checkbox">
                <label>
                  <input
                    type="radio"
                    name="pagination"
                    checked={element === this.props.pageNumber}
                    onChange={() => {
                      if (element > 0) {
                        this.props.setPageNumber(element);
                      }
                    }}
                  />
                  {element > 0 ? (
                    <span>{element}</span>
                  ) : (
                    <span className="disabled">{"..."}</span>
                  )}
                </label>
              </li>
            ))}
            {this.props.pageNumber < this.props.amountOfPages && (
              <li>
                <button
                  onClick={() =>
                    this.props.setPageNumber(this.props.pageNumber + 1)
                  }
                >
                  <ArrowUpSVG svgClassName="flip180" />
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    );
  }
}

export default Pagination;
