-- Create blog posts table
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    published BOOLEAN DEFAULT false,
    featured_image_url TEXT,
    meta_description TEXT,
    author_id UUID DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tags table
CREATE TABLE tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3b5bdb',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#b3c7e6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create junction table for post-tag relationships
CREATE TABLE post_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(post_id, tag_id)
);

-- Create junction table for post-category relationships
CREATE TABLE post_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(post_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
CREATE INDEX idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on blog_posts
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published posts
CREATE POLICY "Public can view published blog posts" ON blog_posts
    FOR SELECT USING (published = true);

CREATE POLICY "Public can view all tags" ON tags
    FOR SELECT USING (true);

CREATE POLICY "Public can view all categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public can view post_tags for published posts" ON post_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM blog_posts 
            WHERE blog_posts.id = post_tags.post_id 
            AND blog_posts.published = true
        )
    );

CREATE POLICY "Public can view post_categories for published posts" ON post_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM blog_posts 
            WHERE blog_posts.id = post_categories.post_id 
            AND blog_posts.published = true
        )
    );

-- Admin policies (you'll need to replace 'YOUR_USER_ID' with your actual user ID)
-- For now, we'll use a simple approach - you can update this later with your actual user ID
CREATE POLICY "Admin can manage blog posts" ON blog_posts
    FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Admin can manage tags" ON tags
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage categories" ON categories
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage post_tags" ON post_tags
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage post_categories" ON post_categories
    FOR ALL USING (auth.uid() IS NOT NULL);