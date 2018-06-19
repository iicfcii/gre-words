import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import WordTable from './word-table';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ipcRenderer} from "electron";

const styles = {
  card: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems:'stretch',
    minWidth: 500,
  },
  cardHeader: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    maxHeight: 80,
  },
  menuContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'flex-start',
    paddingTop: 12,
    paddingLeft: 16,
    paddingRight: 24,
    maxHeight: 60,
  },
  cardContent: {
    display: 'flex',
    flex: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 64,
    maxHeight: 500,
    overflow: 'auto',
  },
};

class HistoryCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      menuAnchor: null,
      word: null,
      history: null,
    };

    // Handle incoming word
    ipcRenderer.on('history', (evt, h) => {
      console.log('Received history');
      if (h.length === 0){
        return;
      }

      this.setState({
        history: h,
      });
    });

    this.getMenuOpen = () => {
      if (!this.state.history){
        return false;
      }

      if (!this.state.menuAnchor){
        return false;
      }

      return true;
    }


    this.handleClick = event => {
      this.setState({ menuAnchor: event.currentTarget });
    };

    this.handleItemClick = (w) => {
      console.log('clicked');
      this.setState({
        menuAnchor: null,
        word: w,
      });
    };

    this.handleClose = () => {
      this.setState({ menuAnchor: null });
    };

    this.renderMenuItems = () => {
      if (this.state.history === null || this.state.history.length === 0){
        return null;
      }

      let menuItems = [];
      for (let i = 0; i < this.state.history.length; i ++){
        menuItems.push(
          <MenuItem
            key = {this.state.history[i].word}
            onClick={() => {
              this.handleItemClick(this.state.history[i]);
            }}>
            {this.state.history[i].word}
          </MenuItem>
        );
      }
      return menuItems;
    }

    this.renderWordTable = () => {
      if (!this.state.word){
        return null;
      }

      return (
        <WordTable
          word = {this.state.word}
          isShown = {true}/>
      );
    }
  }
  componentDidMount(){
    // Request history when component is created
    ipcRenderer.send('getHistory');
  }
  componentWillUnmount(){
    ipcRenderer.removeAllListeners('history');
  }
  render() {
    const {classes} = this.props;
    const { menuAnchor } = this.state;
    return (
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          title = {'History'}
          action = {
            <div className={classes.menuContainer}>
              <Button
                size="large"
                variant="contained"
                onClick={this.handleClick}>
                Select Word
              </Button>
              <Menu
                anchorEl={menuAnchor}
                open={this.getMenuOpen()}
                onClose={this.handleClose}
                PaperProps={{
                  style: {
                    maxHeight: 400,
                    width: 200,
                  },
                }}>
                {this.renderMenuItems()}
              </Menu>
            </div>
          }/>
          <CardContent className={classes.cardContent}>
            {this.renderWordTable()}
          </CardContent>
      </Card>
    );
  }
}


HistoryCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HistoryCard);
