import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import withRoot from '../withRoot';

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: 240,
  },
  subList: {
    maxHeight: 400,
    overflow: 'auto',
  },
  toolbar: {
    width: `100%`,
    minHeight: 56,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class LeftDrawer extends React.Component {
  constructor(props){
    super(props);

    const NUM_LIST = 30;

    this.state = {
      isExpanded: false,
    };


    this.renderLists = (classes) => {
      if (!this.state.isExpanded){
        return null;
      }
      let listItems = [];
      for (let i = 0; i < NUM_LIST; i ++){
        let listNumber = i + 1;

        let handleListClick = () => {
          this.props.updateList(listNumber);
          // console.log('List ' + listNumber + ' clicked.');
        }
        listItems.push(
          <ListItem
            button
            onClick = {handleListClick}
            className={classes.nested}
            key = {'List ' + listNumber}>
            <ListItemText primary={"List " + listNumber} />
          </ListItem>
        );
      }

      return listItems;
    }

    this.renderExpandIcon = () => {
      if (this.state.isExpanded){
        return(<ExpandMore />);
      } else {
        return(<ExpandLess />);
      }
    };

    this.handleListsClick = () => {
      let newState = {
        currentList: this.state.currentList,
        isExpanded: !this.state.isExpanded,
      }
      this.setState(newState);
    };

    this.handleHomeCliclk = () => {
      this.props.setPage('home');
    }

    this.handleHistoryCliclk = () => {
      this.props.setPage('history');
    }

    this.handleSettingCliclk = () => {
      this.props.setPage('setting');
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor='left'
      >
      <div className={classes.toolbar} />
        <ListItem button onClick = {this.handleHomeCliclk}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={this.handleListsClick}>
          <ListItemText primary="Lists" />
          {this.renderExpandIcon()}
        </ListItem>
        <Collapse in={true} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={classes.subList}>
            {this.renderLists(classes)}
          </List>
        </Collapse>
        <ListItem button onClick = {this.handleHistoryCliclk}>
          <ListItemText primary="History" />
        </ListItem>
        <Divider />
        <ListItem button onClick = {this.handleSettingCliclk}>
          <ListItemText primary="Setting" />
        </ListItem>
      </Drawer>
    );
  }
}

LeftDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LeftDrawer);
