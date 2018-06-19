import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import WordTable from './word-table';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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
  cardContent: {
    display: 'flex',
    flex: 12,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems:'center',
    paddingTop: 0,
    marginBottom: 300,
    paddingRight: 0,
    maxHeight: 500,
    overflow: 'auto',
  },
};

class SettingCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      shuffleDialogOpen: false,
      resetDialogOpen: false,
      reorderDialogOpen: false,
    };

    this.handleClose = () => {
      this.setState({
        shuffleDialogOpen: false,
        resetDialogOpen: false,
        reorderDialogOpen: false,
      });
    }

    this.handleShuffleClick = () => {
      this.setState({
        shuffleDialogOpen: true,
      });
    }
    this.handleShuffleYes = () => {
      ipcRenderer.send('shuffle');
      this.setState({
        shuffleDialogOpen: false,
      });
    }

    this.handleResetClick = () => {
      this.setState({
        resetDialogOpen: true,
      });
    }
    this.handleResetYes = () => {
      ipcRenderer.send('reset');
      this.setState({
        resetDialogOpen: false,
      });
    }

    this.handleReorderClick = () => {
      this.setState({
        reorderDialogOpen: true,
      });
    }
    this.handleReorderYes = () => {
      ipcRenderer.send('reorder');
      this.setState({
        reorderDialogOpen: false,
      });
    }

  }

  render() {
    const {classes} = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          title = {'Setting'}/>
          <CardContent className={classes.cardContent}>
            <Button
              size="large"
              variant="contained"
              onClick={this.handleShuffleClick}>
              Shuffle
            </Button>
            <Dialog
              open={this.state.shuffleDialogOpen}
              onClose={this.handleClose}
            >
              <DialogTitle>{"Shuffle all the words?"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This operation will change the current order of all words. Are you sure?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose}>
                  No
                </Button>
                <Button onClick={this.handleShuffleYes} autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>

            <Button
              size="large"
              variant="contained"
              onClick={this.handleReorderClick}>
              Reorder
            </Button>
            <Dialog
              open={this.state.reorderDialogOpen}
              onClose={this.handleClose}
            >
              <DialogTitle>{"Reorder all the words?"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This operation will reset the order of all words. Are you sure?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose}>
                  No
                </Button>
                <Button onClick={this.handleReorderYes} autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>

            <Button
              size="large"
              variant="contained"
              onClick={this.handleResetClick}>
              Reset
            </Button>
            <Dialog
              open={this.state.resetDialogOpen}
              onClose={this.handleClose}
            >
              <DialogTitle>{"Reset forget times of all the words?"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This operation will clear all the forget times. Are you sure?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose}>
                  No
                </Button>
                <Button onClick={this.handleResetYes} autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
      </Card>
    );
  }
}


SettingCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SettingCard);
