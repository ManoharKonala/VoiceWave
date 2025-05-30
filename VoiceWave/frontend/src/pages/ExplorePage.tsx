import * as React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { Mic, Headphones, TrendingUp, Whatshot } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const ExplorePage: React.FC = () => {
  const categories = [
    {
      id: 1,
      title: 'Popular',
      description: 'Discover trending audio content',
      icon: <Whatshot sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      id: 2,
      title: 'New Releases',
      description: 'Freshly uploaded audio content',
      icon: <Mic sx={{ fontSize: 40, color: 'secondary.main' }} />,
    },
    {
      id: 3,
      title: 'Trending',
      description: 'What\'s hot right now',
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Explore Audio Content
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover amazing audio content from creators around the world
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={4}>
              <StyledCard>
                <CardActionArea sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{category.icon}</Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {category.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Recently Added Section */}
        <Box sx={{ mt: 12 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
            Recently Added
          </Typography>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item key={item} xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardActionArea>
                    <CardMedia
                      component="div"
                      sx={{
                        pt: '100%',
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Headphones sx={{ fontSize: 60, color: 'text.secondary' }} />
                    </CardMedia>
                    <CardContent>
                      <Typography variant="h6" noWrap>
                        Audio Title {item}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        Creator Name
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ExplorePage;
