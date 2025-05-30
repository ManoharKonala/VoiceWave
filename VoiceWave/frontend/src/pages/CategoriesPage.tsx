import * as React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardActionArea, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const categories = [
  {
    id: 1,
    name: 'Music',
    description: 'Songs, beats, and musical compositions',
    color: 'primary',
    count: 245,
  },
  {
    id: 2,
    name: 'Podcasts',
    description: 'Talk shows, interviews, and discussions',
    color: 'secondary',
    count: 189,
  },
  {
    id: 3,
    name: 'Audiobooks',
    description: 'Books in audio format',
    color: 'success',
    count: 132,
  },
  {
    id: 4,
    name: 'ASMR',
    description: 'Autonomous sensory meridian response content',
    color: 'error',
    count: 98,
  },
  {
    id: 5,
    name: 'Meditation',
    description: 'Guided meditations and relaxation',
    color: 'info',
    count: 87,
  },
  {
    id: 6,
    name: 'Education',
    description: 'Learning and educational content',
    color: 'warning',
    count: 154,
  },
];

const CategoriesPage: React.FC = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Browse Categories
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore audio content by category
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={4}>
              <CategoryCard>
                <CardActionArea sx={{ p: 3, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" component="h2" sx={{ mr: 1, fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                      <Chip 
                        label={category.count} 
                        size="small" 
                        color={category.color as any}
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {category.description}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={`${category.color}.main`} 
                      sx={{ fontWeight: 600 }}
                    >
                      Explore {category.name.toLowerCase()}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Can't find what you're looking for?
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            We're constantly adding new categories and content. Let us know what you'd like to see!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CategoriesPage;
