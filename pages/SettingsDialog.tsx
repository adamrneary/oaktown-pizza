import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import SliderElement from "./SliderElement";
import { Starter, Yeast } from "../utils/getRecipeRows";

export default function SettingsDialog({
  open,
  handleClose,
  ovenTemp,
  setOvenTemp,
  pieCount,
  setPieCount,
  starter,
  setStarter,
  nightsAging,
  setNightsAging,
  useMalt,
  setUseMalt,
  pieSize,
  setPieSize,
  yeastType,
  setYeastType,
}) {
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Configure Your Pizza Game
      </DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: 24 }}>
          <FormControl fullWidth>
            <Typography id="starter-type" gutterBottom>
              Starter type
            </Typography>
            <Select
              labelId="starter-type"
              id="starter-type-select"
              value={starter}
              onChange={(event) => {
                setStarter(event.target.value);
              }}
            >
              <MenuItem value={Starter.Levain}>Levain</MenuItem>
              <MenuItem value={Starter.Poolish}>
                Poolish (100% Hydration)
              </MenuItem>
              <MenuItem value={Starter.Biga}>Biga (70% Hydration)</MenuItem>
              <MenuItem value={Starter.None}>None</MenuItem>
            </Select>
          </FormControl>
        </div>
        {starter !== Starter.Levain && (
          <div style={{ marginBottom: 24 }}>
            <FormControl fullWidth>
              <Typography id="starter-type" gutterBottom>
                Yeast type
              </Typography>
              <Select
                labelId="yeast-type"
                id="yeast-type-select"
                value={yeastType}
                onChange={(event) => {
                  setYeastType(event.target.value);
                }}
              >
                <MenuItem value={Yeast.Active}>Active Dry Yeast</MenuItem>
                <MenuItem value={Yeast.Instant}>Instant Yeast</MenuItem>
                <MenuItem value={Yeast.Fresh}>Fresh (Brewer's) Yeast</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}
        <SliderElement
          id="temp-input-slider"
          min={0}
          max={1000}
          step={5}
          value={ovenTemp}
          label="Oven temperature"
          onChange={setOvenTemp}
        />
        <SliderElement
          id="count-input-slider"
          min={0}
          max={24}
          step={1}
          value={pieCount}
          label="Pie count"
          onChange={setPieCount}
        />
        <SliderElement
          id="size-input-slider"
          min={8}
          max={24}
          step={2}
          value={pieSize}
          label="Target pie size (in)"
          onChange={setPieSize}
        />
        <SliderElement
          id="aging-input-slider"
          min={0}
          max={2}
          step={1}
          value={nightsAging}
          label="Nights aging"
          onChange={setNightsAging}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={useMalt}
              onChange={setUseMalt}
              name="malt"
              color="primary"
            />
          }
          label="Use a little diastatic malt"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Calculate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
