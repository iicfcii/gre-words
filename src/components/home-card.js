import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import WordTable from './word-table';

const styles = {
  card: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'stretch',
    minWidth: 500,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
    paddingRight: 64,
  },
};

class HomeCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render() {
    const {classes} = this.props;
    return (
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography variant="display2" noWrap>
            Welcome to GRE words
          </Typography>
          <Typography variant="display1" noWrap>
            {"Let's remember them all!"}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}


HomeCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeCard);
