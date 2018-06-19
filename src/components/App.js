import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import withRoot from '../withRoot';
import LeftDrawer from './left-drawer';
import WordCard from './word-card';
import HomeCard from './home-card';
import HistoryCard from './history-card';
import SettingCard from './setting-card';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    width: `100%`,
    minHeight: 56,
    zIndex: theme.zIndex.drawer+1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  toolbar: {
    width: `100%`,
    minHeight: 56,
  },
  contentContainer: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    padding: 0,
    minWidth: 0, // So the Typography noWrap works
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit*5,
    minWidth: 0, // So the Typography noWrap works
  },
});


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      page: 'home',
      list: 1,
    };

    this.renderCard = () => {
      if (this.state.page === 'home'){
        return(<HomeCard/>);
      } else if (this.state.page === 'list'){
        return(<WordCard list = {this.state.list}/>);
      }
      else if (this.state.page === 'history'){
        return(<HistoryCard/>);
      }
      else if (this.state.page === 'setting'){
        return(<SettingCard/>);
      } else {
        return null;
      }
    }

    this.setPage = (p) => {
      let newState = {
        page: p,
        list: this.state.list,
      };
      this.setState(newState);
    }

    this.updateList = (l) => {
      let newState = {
        page: 'list',
        list: l,
      };
      this.setState(newState);
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar)}
        >
          <Toolbar className={classes.toolbar}>
            <Typography variant="title" color="inherit" noWrap>
              GRE Words
            </Typography>
          </Toolbar>
        </AppBar>

        <LeftDrawer
          setPage = {this.setPage}
          updateList = {this.updateList}/>

        <main className={classes.contentContainer}>
          <div className={classes.toolbar} />
          <Grid container
            className={classes.content}
            direction='row'
            justify="center"
            alignItems='stretch'
            alignContent='stretch'
            spacing={16}
          >
            {this.renderCard()}
          </Grid>
        </main>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));
