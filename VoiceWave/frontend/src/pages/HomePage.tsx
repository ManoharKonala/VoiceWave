import * as React from 'react';
import { Box, Typography, Button, Container, Paper, Grid, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Mic, Headphones, Upload } from '@mui/icons-material';

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[10],
    border: `1px solid ${theme.palette.primary.light}`,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 90,
  height: 90,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.primary.main}20 100%)`,
  '& svg': {
    color: theme.palette.primary.main,
    transition: 'transform 0.3s ease-in-out',
  },
  [theme.breakpoints.down('sm')]: {
    width: 80,
    height: 80,
    '& svg': {
      fontSize: 40,
    },
  },
}));

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Mic sx={{ fontSize: 48 }} />,
      title: 'Record Your Voice',
      description: 'Easily record and share your voice with the community using our intuitive recording tools.',
    },
    {
      icon: <Headphones sx={{ fontSize: 48 }} />,
      title: 'Discover Audio',
      description: 'Explore a vast library of audio content from creators around the world.',
    },
    {
      icon: <Upload sx={{ fontSize: 48 }} />,
      title: 'Share & Connect',
      description: 'Share your creations and connect with a community of audio enthusiasts.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          borderRadius: '0 0 100px 100px',
          overflow: 'hidden',
          position: 'relative',
          mb: 8,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, sm: 4 } }}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="white"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                lineHeight: 1.2,
                mb: 3,
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              Welcome to <Box component="span" sx={{ color: 'secondary.light' }}>VoiceWave</Box>
            </Typography>
            <Typography 
              variant="h5" 
              align="center" 
              color="rgba(255,255,255,0.9)" 
              sx={{ 
                mb: 5,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                lineHeight: 1.6,
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              Share your voice, discover amazing audio content, and connect with a global community of creators and listeners.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 3,
              flexWrap: 'wrap',
              mt: 4
            }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: { xs: 4, sm: 5 },
                  py: 1.5,
                  borderRadius: 50,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: `0 4px 20px ${theme.palette.secondary.main}40`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 24px ${theme.palette.secondary.main}60`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => {
                  const features = document.getElementById('features');
                  features?.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{
                  px: { xs: 4, sm: 5 },
                  py: 1.5,
                  borderRadius: 50,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8, px: { xs: 2, sm: 0 } }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem' },
                lineHeight: 1.2,
                color: 'text.primary',
              }}
            >
              Why Choose <Box component="span" sx={{ color: 'primary.main' }}>VoiceWave</Box>?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{
                color: 'text.secondary',
                maxWidth: 700,
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.6,
              }}
            >
              Experience the best platform for audio content creation and discovery,
              designed with creators and listeners in mind.
            </Typography>
          </Box>
          
          <Grid container spacing={4} sx={{ px: { xs: 2, sm: 0 } }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard 
                  elevation={3}
                  sx={{
                    '&:hover': {
                      '& $featureIcon': {
                        transform: 'scale(1.05)',
                        '& svg': {
                          transform: 'scale(1.1)',
                        },
                      },
                    },
                  }}
                >
                  <FeatureIcon className="featureIcon">
                    {feature.icon}
                  </FeatureIcon>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700, 
                      color: 'text.primary',
                      mb: 2,
                      fontSize: '1.5rem',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{
                      fontSize: '1.05rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{
          py: { xs: 10, md: 16 },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at bottom right, rgba(255,255,255,0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 800, 
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.75rem' },
                lineHeight: 1.2,
              }}
            >
              Ready to Start Your Audio Journey?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 700,
                mx: 'auto',
                mb: 5,
                opacity: 0.9,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                lineHeight: 1.6,
              }}
            >
              Join thousands of creators and listeners on VoiceWave. Share your voice, 
              discover amazing content, and be part of a growing community.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 3,
              flexWrap: 'wrap',
              '& .MuiButton-root': {
                minWidth: 200,
              }
            }}>
              <Button 
                variant="contained" 
                color="secondary"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 50,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  boxShadow: `0 4px 20px ${theme.palette.secondary.main}40`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 24px ${theme.palette.secondary.main}60`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Sign Up Free
              </Button>
              <Button 
                variant="outlined" 
                color="inherit"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 50,
                  fontWeight: 600,
                  borderWidth: 2,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
          
          {/* Decorative elements */}
          <Box 
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              zIndex: 0,
            }}
          />
          <Box 
            sx={{
              position: 'absolute',
              bottom: -80,
              left: -80,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
              zIndex: 0,
            }}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
