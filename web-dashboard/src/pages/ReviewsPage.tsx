import { motion } from 'motion/react';
import { useState } from 'react';
import { MessageSquare, Search, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { mockReviews } from '../utils/mockData';
import { useDebounce } from '../hooks/useDebounce';
import { Progress } from '../components/ui/progress';

export function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter reviews
  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.text.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      review.id.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesSentiment =
      sentimentFilter === 'all' || review.sentiment === sentimentFilter;
    return matchesSearch && matchesSentiment;
  });

  // Calculate sentiment stats
  const sentimentCounts = {
    Positive: mockReviews.filter((r) => r.sentiment === 'Positive').length,
    Neutral: mockReviews.filter((r) => r.sentiment === 'Neutral').length,
    Fake: mockReviews.filter((r) => r.sentiment === 'Fake').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h2>Review Analysis</h2>
        <p className="text-muted-foreground">
          NLP-based sentiment analysis for fake review detection using behavioral features
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Positive Reviews</p>
                  <Badge className="bg-success">
                    {((sentimentCounts.Positive / mockReviews.length) * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-success">{sentimentCounts.Positive}</p>
                <Progress
                  value={(sentimentCounts.Positive / mockReviews.length) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Neutral Reviews</p>
                  <Badge variant="secondary">
                    {((sentimentCounts.Neutral / mockReviews.length) * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-muted-foreground">{sentimentCounts.Neutral}</p>
                <Progress
                  value={(sentimentCounts.Neutral / mockReviews.length) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Fake Reviews</p>
                  <Badge variant="destructive">
                    {((sentimentCounts.Fake / mockReviews.length) * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-destructive">{sentimentCounts.Fake}</p>
                <Progress
                  value={(sentimentCounts.Fake / mockReviews.length) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sentiment Filter */}
              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="Positive">Positive</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Fake">Fake</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reviews List */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Reviews ({filteredReviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="rounded-lg border border-border p-4 hover:bg-accent/5 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          review.sentiment === 'Positive'
                            ? 'bg-success/10'
                            : review.sentiment === 'Neutral'
                            ? 'bg-muted'
                            : 'bg-destructive/10'
                        }`}
                      >
                        <MessageSquare
                          className={`h-5 w-5 ${
                            review.sentiment === 'Positive'
                              ? 'text-success'
                              : review.sentiment === 'Neutral'
                              ? 'text-muted-foreground'
                              : 'text-destructive'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p>{review.id}</p>
                          <Badge
                            variant={
                              review.sentiment === 'Positive'
                                ? 'default'
                                : review.sentiment === 'Neutral'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {review.sentiment}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {review.detectionMethod}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? 'fill-warning text-warning'
                                    : 'fill-muted text-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span>{new Date(review.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Sentiment Score</p>
                      <p
                        className={
                          review.sentimentScore > 0.7
                            ? 'text-success'
                            : review.sentimentScore > 0.4
                            ? 'text-warning'
                            : 'text-destructive'
                        }
                      >
                        {(review.sentimentScore * 100).toFixed(1)}%
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Conf: {review.confidenceScore}%
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed pl-13">
                    {review.text}
                  </p>

                  <div className="flex items-center justify-between pl-13">
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <span>Product: {review.productId}</span>
                      <span>•</span>
                      <span>User: {review.userId}</span>
                      <span>•</span>
                      <span>Account Age: {review.accountAge} days</span>
                      <span>•</span>
                      <span>Review Freq: {review.reviewFrequency}</span>
                    </div>
                  </div>

                  {review.suspiciousPatterns.length > 0 && (
                    <div className="pl-13 flex flex-wrap gap-2 items-center">
                      <span className="text-muted-foreground text-sm">
                        Suspicious Patterns:
                      </span>
                      {review.suspiciousPatterns.map((pattern, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}