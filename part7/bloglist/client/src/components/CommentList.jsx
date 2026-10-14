import { Fragment } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

const CommentList = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No comments yet
      </Typography>
    );
  }

  return (
    <Paper variant="outlined">
      <List disablePadding>
        {comments.map((comment, index) => (
          <Fragment key={index}>
            {index > 0 && <Divider component="li" />}
            <ListItem
              alignItems="flex-start"
              sx={{ bgcolor: index % 2 === 1 ? "action.hover" : "transparent" }}
            >
              <ListItemText primary={comment} />
            </ListItem>
          </Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default CommentList;
