import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

type Props = {
  title: string;
  subtitle?: string;
  rows: {
    item: string;
    weightG: string;
    bakersPercent: string;
  }[];
};

const useStyles = makeStyles({
  tableHead: {
    fontWeight: 600,
    fontSize: "1rem",
  },

  cell: {
    fontFamily: "Lato",
    fontSize: "1rem",
  },
});

export default function RecipeItem({ title, subtitle, rows }: Props) {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h2" gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label={title}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHead}>Item</TableCell>
              <TableCell className={classes.tableHead} align="right">
                Weight (g)
              </TableCell>
              <TableCell className={classes.tableHead} align="right">
                Baker's %
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.map((row) => (
                <TableRow key={`${row.item}${row.weightG}`}>
                  <TableCell
                    className={classes.cell}
                    component="th"
                    scope="row"
                  >
                    {row.item}
                  </TableCell>
                  <TableCell className={classes.cell} align="right">
                    {row.weightG}
                  </TableCell>
                  <TableCell className={classes.cell} align="right">
                    {row.bakersPercent}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {subtitle && (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Typography variant="body2" gutterBottom>
            {subtitle}
          </Typography>
        </div>
      )}
    </>
  );
}
