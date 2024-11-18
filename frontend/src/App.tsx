import React, { useState } from 'react'
import axios from 'axios'
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

export default function App() {
  const [settings, setSettings] = useState<Record<string, string>>({
    // General settings
    "figure.figsize": "8, 6",
    "figure.dpi": "80",
    // Axes settings
    "axes.facecolor": "w",
    "axes.edgecolor": "k",
    "axes.linewidth": "1.0",
    "axes.grid": "False",
    "axes.titlesize": "large",
    "axes.labelsize": "medium",
    // Lines settings
    "lines.linewidth": "1.0",
    "lines.linestyle": "-",
    "lines.color": "b",
    "lines.marker": "None",
    "lines.markerfacecolor": "auto",
    "lines.markeredgecolor": "auto",
    "lines.markeredgewidth": "0.5",
    "lines.markersize": "6",
    // Marker props
    "markers.fillstyle": "full",
    // Patches
    "patch.linewidth": "1.0",
    "patch.facecolor": "b",
    "patch.edgecolor": "k",
    // Font
    "font.family": "sans-serif",
    "font.style": "normal",
    "font.size": "12.0",
    // Text
    "text.color": "k",
    "text.usetex": "False",
    // Ticks
    "xtick.major.size": "4",
    "xtick.minor.size": "2",
    "ytick.major.size": "4",
    "ytick.minor.size": "2",
    // Grid
    "grid.color": "k",
    "grid.linestyle": ":",
    "grid.linewidth": "0.5",
    // Legend
    "legend.fontsize": "large",
    "legend.frameon": "True",
    // Figure
    "figure.titlesize": "medium",
    "figure.titleweight": "normal",
    // Image
    "image.cmap": "jet",
    "image.aspect": "equal",
    // Contour
    "contour.negative_linestyle": "dashed",
    // Errorbar
    "errorbar.capsize": "3",
    // Scatter
    "scatter.marker": "o",
    // Boxplot
    "boxplot.notch": "False",
    "boxplot.vertical": "True",
    // Agg rendering
    "agg.path.chunksize": "0",
  })
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const generateChart = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post('http://127.0.0.1:8080/generate-chart', {
        mplstyle: settings
      }, { responseType: 'blob' })

      const url = URL.createObjectURL(response.data)
      setImageUrl(url)
    } catch (error) {
      console.error("Error generating chart:", error)
      setError("Failed to generate chart. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderSettingsGroup = (groupPrefix: string, title: string) => (
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${groupPrefix}-settings-content`}
        id={`${groupPrefix}-settings-header`}
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {Object.entries(settings).map(([key, value]) => {
            if (key.startsWith(groupPrefix)) {
              return (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <TextField
                    fullWidth
                    label={key.replace(`${groupPrefix}.`, '')}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              )
            }
            return null
          })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Chart Style Preview
          </Typography>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            {renderSettingsGroup('figure', 'Figure Settings')}
            {renderSettingsGroup('axes', 'Axes Settings')}
            {renderSettingsGroup('lines', 'Lines Settings')}
            {renderSettingsGroup('markers', 'Marker Props')}
            {renderSettingsGroup('patch', 'Patches')}
            {renderSettingsGroup('font', 'Font')}
            {renderSettingsGroup('text', 'Text')}
            {renderSettingsGroup('xtick', 'X Ticks')}
            {renderSettingsGroup('ytick', 'Y Ticks')}
            {renderSettingsGroup('grid', 'Grid')}
            {renderSettingsGroup('legend', 'Legend')}
            {renderSettingsGroup('image', 'Image')}
            {renderSettingsGroup('contour', 'Contour')}
            {renderSettingsGroup('errorbar', 'Error Bar')}
            {renderSettingsGroup('scatter', 'Scatter')}
            {renderSettingsGroup('boxplot', 'Boxplot')}
            {renderSettingsGroup('agg', 'Agg Rendering')}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={generateChart}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? 'Generating...' : 'Generate Chart'}
              </Button>
            </Box>
          </Paper>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {imageUrl && (
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <img src={imageUrl} alt="Generated Chart" style={{ maxWidth: '100%', height: 'auto' }} />
            </Paper>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  )
}