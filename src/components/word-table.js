import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import '../css/word-table.css';
import jetpack from "fs-jetpack";
import { remote } from "electron";

const styles = {
  table:{
    display: 'table',
    width: '100%',
    textAlign: 'center',
  },
  colLeft: {
    width: '20%',
  },
  colRight: {
    width: '80%',
  },
};

class WordTable extends React.Component {
  constructor(props){
    super(props);

    const app = remote.app;
    const appDir = jetpack.cwd(app.getAppPath());
    // console.log(app.getAppPath());
    this.state = {
    };

    this.loadStr = () => {
      if (this.props.word){
        // console.log(this.props.word.word);
        this.str = appDir.read('./app/words/' + this.props.word.word + '.html', "utf8");
      }
      return null;
    }
  }
  componentDidMount(){
    // Force update to load word
    this.setState({});
  }
  componentDidUpdate(){
    this.loadStr();
    if (!this.str){
      return;
    }

    // Either add or delete then add
    let numRows = document.getElementById('wordTable').rows.length;
    if (numRows === 0){
      this.ref.innerHTML += this.str;
    } else {
      for (let i = 0; i < numRows; i ++){
        document.getElementById('wordTable').deleteRow(-1);
      }
      this.ref.innerHTML += this.str;
    }

    numRows = document.getElementById('wordTable').rows.length;
    if (!this.props.isShown){
      for (let i = 1; i < numRows; i ++){
        document.getElementById('wordTable').rows[i].style.display='none'; // set to '' to display explain
      }
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <table
        ref={r=>this.ref = r}
        className={classes.table}
        id = 'wordTable'
      >
        <colgroup>
          <col className={classes.colLeft}/>
          <col className={classes.colRight}/>
        </colgroup>

      </table>
    );
  }
}


WordTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WordTable);
