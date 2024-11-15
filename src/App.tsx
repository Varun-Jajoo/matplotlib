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
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

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

export default function ChartStylePreview() {
  const [settings, setSettings] = useState<Record<string, string>>({
    "figure.figsize": "6,4",
    "axes.labelsize": "12",
    "lines.linewidth": "2",
    "axes.linewidth ":"1.0"
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Chart Style Preview
          </Typography>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              {Object.entries(settings).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    label={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
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