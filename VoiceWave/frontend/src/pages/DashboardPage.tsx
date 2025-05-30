import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Mic, Headset, Upload, Person } from '@mui/icons-material';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const username = 'User'; // This would come from your auth context

  const features = [
    {
      icon: <Mic sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Record Audio',
      description: 'Create and record your own audio content with our easy-to-use recorder.',
      action: () => navigate('/record'),
      actionText: 'Start Recording'
    },
    {
      icon: <Headset sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Listen',
      description: 'Discover and listen to audio content from creators around the world.',
      action: () => navigate('/explore'),
      actionText: 'Browse Content'
    },
    {
      icon: <Upload sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Upload',
      description: 'Upload your pre-recorded audio files to share with the community.',
      action: () => navigate('/upload'),
      actionText: 'Upload Files'
    },
    {
      icon: <Person sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Profile',
      description: 'View and manage your profile, audio uploads, and listening history.',
      action: () => navigate('/profile'),
      actionText: 'View Profile'
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome back, {username}!
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          What would you like to do today? Here are some quick actions to get you started.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                {feature.description}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={feature.action}
                fullWidth
                sx={{ mt: 'auto' }}
              >
                {feature.actionText}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Ready to start creating?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          Join our community of audio creators and share your voice with the world. Record, upload, and connect with listeners.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/record')}
          sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 600 }}
        >
          Start Creating
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardPage;
