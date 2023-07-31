import React, { Component } from "react";
import axios from "axios";
import "./App.css";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: null,
      playerStats: {},
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.getPlayerId();
    console.log(this.state.playerName);
  };

  handleChange = (event) => {
    const playerName = event.target.value.trim(); // Remove spaces before and after the name
    const replace = playerName.replace(/\s+/g, ' '); // Remove extra spaces inside the name
    if (replace.length > 0) {
      this.setState({ playerName: replace });
    }
  };
  
  getPlayerId = () => {
    axios.get(`https://www.balldontlie.io/api/v1/players?search=${this.state.playerName}`)
      .then(async (res) => {
        // console.log(res.data.data);
        if (res.data.data[0] === undefined) {
          alert("This player is either injured or hasn't played yet!");
        } else if (res.data.data.length > 1) {
          alert("Please specify or check the spelling of the player's name!");
        } else {
          await this.getPlayerStats(res.data.data[0].id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getPlayerStats = (playerId) => {
    axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2022&player_ids[]=${playerId}`)
      .then(async (res) => {
        console.log(res.data.data);
        this.setState({ playerStats: res.data.data[0] });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="App">
        <div className="Header">NBA Stat Tracker</div>
        <h2>
          Welcome to my NBA Stat Tracker Application! <br />
          <br /> To see the season averages of a player from the 2022-23 season, enter their name below.
        </h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
              placeholder="Please enter player's name"
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <div className="Scoreboard">
          <div className="Score"><p>Games Played:</p> 
          <p>{this.state.playerStats["games_played"]}</p>
          </div>
          <div className="Score"><p>Points Per Game: </p>
          <p>{this.state.playerStats["pts"]}</p>
          </div>
          <div className="Score">
            <p>Rebounds Per Game:</p>
            <p>{this.state.playerStats["reb"]}</p>
            </div>
          <div className="Score">
            <p>Assists Per Game:</p>
          <p>{this.state.playerStats["ast"]}</p>
          </div>
          <div className="Score">
            <p>Blocks Per Game:</p>
            <p>{this.state.playerStats["blk"]}</p>
            </div>
          <div className="Score"><p>Steals Per Game:</p>
          <p>{this.state.playerStats["stl"]}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
