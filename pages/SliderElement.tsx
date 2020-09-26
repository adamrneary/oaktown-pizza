import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

type Props = {
  min: number;
  max: number;
  step: number;
  value: number;
  label: string;
  id: string;
  onChange: (value: number) => void;
};

export default function SliderElement({
  id,
  min,
  max,
  step,
  value,
  label,
  onChange,
}: Props) {
  return (
    <div style={{ marginBottom: 8 }}>
      <Typography id={id} gutterBottom>
        {label}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={10}>
          <Slider
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(_, value) => {
              if (Array.isArray(value)) return;
              onChange(value);
            }}
            aria-labelledby="oven-input-slider"
          />
        </Grid>
        <Grid item xs={2}>
          <Input
            value={value}
            margin="dense"
            fullWidth
            type="number"
            onChange={(e) => {
              onChange(parseInt(e.target.value, 10));
            }}
            inputProps={{
              step,
              min,
              max,
              type: "number",
              "aria-labelledby": id,
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
