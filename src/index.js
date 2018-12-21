import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const key = "";

const WIDTH = window.innerHeight * 0.25;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipVisible: false,
      gifLeft: 0,
      gifBoxWidth: WIDTH,
      gifBoxHeight: WIDTH
    };
  }

  isNotValidString(str) {
    return !str || str.length === 0 || !str.match(/[a-z]/i);
  }

  removePreviousToolTip() {
    //removes previous tooltip

    //remove the highlighted text
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }

    //remove the tooltip if it's visible
    if (this.state.tooltipVisible) {
      this.setState({
        tooltipVisible: !this.state.tooltipVisible,
        gifURL: "",
        gifText: "",
        gifTop: null,
        gifLeft: null
      });
    }
  }

  //fetches gif
  fetchGif(gifText) {
    //replaces spaces with + signs because that's hoow api handles queries with spaces
    var text = gifText.split(" ");
    text = text.join("+");

    var url =
      "https://api.giphy.com/v1/gifs/search?q=" +
      text +
      "&api_key=" +
      key +
      "&limit=1";

    fetch(url)
      .then(res => res.json())
      .then(result => {
        this.setState({
          isLoaded: true,
          gifURL: result.data[0].images.original.url
        });
      });
  }

  renderGIF() {
    var text = window.getSelection().toString();

    //check if valid string, so basically never make a tooltip if we've just highlited something that has no letters
    if (!this.isNotValidString(text)) {
      //get client rect of the string we have highlighted
      var rec = window
        .getSelection()
        .getRangeAt(0)
        .getClientRects();

      //call our fetch gif api, since it's promise based, the url will be fetched before we set state of the tooltip
      this.fetchGif(text);
      this.setState({
        tooltipVisible: !this.state.tooltipVisible,
        gifText: text,
        gifTop: rec[0].top - WIDTH * 1.3,

        //centers the lower triangle in middle of text we have highlighted
        gifLeft: rec[0].x + rec[0].width / 2 - this.state.gifBoxWidth / 2
      });
    }
  }

  render() {
    return (
      <div
        className="App"
        onMouseUp={this.renderGIF.bind(this)}
        onMouseDown={this.removePreviousToolTip.bind(this)}
      >
        <div
          className="tooltip"
          style={{
            position: "absolute",
            top: this.state.gifTop ? this.state.gifTop : 0,
            left: this.state.gifLeft,
            visibility:
              this.state.tooltipVisible &&
              !this.isNotValidString(this.state.gifText)
                ? "visible"
                : "hidden",
            backgroundColor: "#96ddff",
            width: this.state.gifBoxWidth,
            height: this.state.gifBoxHeight,
            border: "1px solid #96ddff",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img
            src={this.state.gifURL}
            alt="Searching..."
            height={WIDTH * 0.85}
            width={WIDTH * 0.85}
          />
        </div>
        <p className="mainText">
          I know now, without a doubt that Kingdom Hearts ❤️ is light!
        </p>
      </div>
    );
  }
}

export default App;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
