import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HistoryIcon from '@material-ui/icons/History';
import Typography from '@material-ui/core/Typography';
import WordTable from './word-table';
import CardHeader from '@material-ui/core/CardHeader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ipcRenderer} from "electron";


const styles = {
  card: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems:'stretch',
    minWidth: 500,
  },
  cardHeader: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    maxHeight: 80,
  },
  cardContent: {
    display: 'flex',
    flex: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 64,
    maxHeight: 550,
    overflow: 'auto',
  },
  cardAction: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'flex-end',
    margin: 12,
  },
};

class WordCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      wordIndex: 1,
      word: null,
      isShown: false,
      isFinished: false,
      anchorHistoryMenu: null,
    };
    // console.log('Word card created ' + this.props.list);

    // Handle incoming word
    ipcRenderer.on('word', (evt, w, wIndex) => {
      // console.log('Received word');
      if (!w){
        this.setState({
          isFinished: true,
        });
        return;
      }

      // console.log('New word');
      let newState = {
        wordIndex: wIndex,
        word: w,
        isShown: false,
        isFinished: false,
      };
      this.setState(newState);
      // this.forceUpdate();
      // console.log(this.state);
    });

    this.renderWordTable = () => {
      if (!this.state.isFinished){
        return(
          <WordTable
            word = {this.state.word}
            isShown = {this.state.isShown}
          />
        );
      } else {
        return(
            <Typography variant="display2" noWrap>
              Finished!
            </Typography>
        );
      }
    }

    this.forgetBtnText = () => {
      if (this.state.word && this.state.isShown){
        return 'Forget ('+this.state.word.forgetTimes+')';
      } else {
        return 'Forget';
      }
    }

    this.handleKeyUp = (event) => {
      if(event.keyCode == 83) {
        // console.log('Down');
        this.handleShowClick();
      }
      if(event.keyCode == 65) {
        // console.log('Left');
        this.handleForgetClick();
      }
      else if(event.keyCode == 68) {
        // console.log('Right');
        this.handleRememberClick();
      }
    }

    this.handleShowClick = () => {
      // console.log(this.state);
      this.setState({
        isShown: true,
      });
    }

    this.handleForgetClick = () => {
      if (!this.state.isShown){
        return;
      }
      // console.log(this.state);
      ipcRenderer.send('nextWord',this.props.list,this.state.word,true);
    }

    this.handleRememberClick = () => {
      if (!this.state.isShown){
        return;
      }
      ipcRenderer.send('nextWord',this.props.list,this.state.word,false);
    }

    this.handleHistoryClick = event => {
      this.setState({
        anchorHistoryMenu: event.currentTarget,
      });
    };

    this.handleHistoryWordClose = () => {
      this.setState({
        anchorHistoryMenu: null,
      });
    };

    this.renderSubheaderAction = () => {
      const { anchorHistoryMenu } = this.state;
      return(
        <div>
          <IconButton
            onClick={this.handleHistoryClick}>
            <HistoryIcon
              style = {{fontSize: 28}}/>
          </IconButton>
          <Menu
            anchorEl={anchorHistoryMenu}
            open={Boolean(anchorHistoryMenu)}
            onClose={this.handleHistoryWordClose}
            PaperProps={{
              style: {
                maxHeight: 400,
                width: 300,
              },
            }}
          >
            <MenuItem onClick={this.handleHistoryWordClose}>Word 1</MenuItem>
            <MenuItem onClick={this.handleHistoryWordClose}>Word 2</MenuItem>
            <MenuItem onClick={this.handleHistoryWordClose}>Word 3</MenuItem>
          </Menu>
        </div>
      );
    }

  }
  componentDidMount(){
    // Request a word when component is created
    ipcRenderer.send('currentWord',this.props.list);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

    if (prevProps.list !== this.props.list ){
      // Request word when list is changed
      // console.log('List changed');
      ipcRenderer.send('currentWord',this.props.list);
    }
  }
  componentWillUnmount(){
    ipcRenderer.removeAllListeners('word');
    document.removeEventListener("keyup", this.handleKeyUp);
  }
  render() {
    const {classes} = this.props;
    return (
      <Card
        className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          title = {'List ' + this.props.list}
          subheader = {'Current word: ' + this.state.wordIndex}/>
        <CardContent className={classes.cardContent}>
          {this.renderWordTable()}
        </CardContent>
        <CardActions className={classes.cardAction}>
          <Button
            size="large"
            variant='contained'
            onClick = {this.handleForgetClick}>
            {this.forgetBtnText()}
          </Button>
          <Button
            size="large"
            variant='contained'
            onClick = {this.handleShowClick}>
            Show
          </Button>
          <Button
            size="large"
            variant='contained'
            onClick = {this.handleRememberClick}
            >
            Remember
          </Button>
        </CardActions>
      </Card>
    );
  }
}


WordCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WordCard);
