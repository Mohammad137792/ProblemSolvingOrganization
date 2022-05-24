import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@bit/mui-org.material-ui.styles";
import ListSubheader from "@bit/mui-org.material-ui.list-subheader";
import List from "@bit/mui-org.material-ui.list";
import ListItem from "@bit/mui-org.material-ui.list-item";
import ListItemIcon from "@bit/mui-org.material-ui.list-item-icon";
import ListItemText from "@bit/mui-org.material-ui.list-item-text";
import Collapse from "@bit/mui-org.material-ui.collapse";
import InboxIcon from "@bit/mui-org.material-ui-icons.move-to-inbox";
import DraftsIcon from "@bit/mui-org.material-ui-icons.drafts";
import SendIcon from "@bit/mui-org.material-ui-icons.send";
import ExpandLess from "@bit/mui-org.material-ui-icons.expand-less";
import ExpandMore from "@bit/mui-org.material-ui-icons.expand-more";
import StarBorder from "@bit/mui-org.material-ui-icons.star-border";

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4
    }
});

class NestedList extends React.Component {
    state = {
        open: true
    };

    handleClick = () => {
        this.setState(state => ({ open: !state.open }));
    };

    render() {
        const { classes } = this.props;

        return <List component="nav" subheader={<ListSubheader component="div">Nested List Items</ListSubheader>} className={classes.root}>
            <ListItem button>
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText inset primary="Sent mail" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <DraftsIcon />
                </ListItemIcon>
                <ListItemText inset primary="Drafts" />
            </ListItem>
            <ListItem button onClick={this.handleClick}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText inset primary="Inbox" />
                {this.state.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button className={classes.nested}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText inset primary="Starred" />
                    </ListItem>
                </List>
            </Collapse>
        </List>;
    }
}

NestedList.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NestedList);