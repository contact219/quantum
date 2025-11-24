import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  FileText, 
  BookOpen, 
  Video, 
  Download,
  ExternalLink,
  ArrowRight
} from "lucide-react";

export default function Resources() {
  const guides = [
    {
      title: "Construction Bond Guide for General Contractors",
      description: "Complete guide to bid, performance, and payment bonds for GCs",
      category: "Guide",
      downloadable: true,
    },
    {
      title: "First-Time Bonding: A Subcontractor's Handbook",
      description: "Step-by-step process for subcontractors getting their first bond",
      category: "Guide",
      downloadable: true,
    },
    {
      title: "Understanding Bond Capacity",
      description: "How sureties calculate your bonding capacity and how to increase it",
      category: "Article",
      downloadable: false,
    },
    {
      title: "Financial Statement Preparation for Bonding",
      description: "What underwriters look for and how to present your financials",
      category: "Guide",
      downloadable: true,
    },
  ];

  const videos = [
    {
      title: "How Surety Bonds Work (5 min)",
      description: "Quick overview of the surety bond process",
      duration: "5:23",
    },
    {
      title: "Bid Bond vs Performance Bond vs Payment Bond",
      description: "Understanding the three main construction bond types",
      duration: "8:15",
    },
    {
      title: "Improving Your Bond Capacity",
      description: "Strategies to qualify for larger projects",
      duration: "12:40",
    },
  ];

  const tools = [
    {
      title: "AI Bond Finder",
      description: "Get instant bond recommendations based on your project",
      link: "/ai-bond-finder",
    },
    {
      title: "Premium Calculator",
      description: "Estimate your bond premium in seconds",
      link: "/quote",
    },
    {
      title: "State Requirements Database",
      description: "Bond requirements by state and project type",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 bg-accent text-accent-foreground" data-testid="badge-resources">
            <BookOpen className="w-4 h-4 mr-1" />
            Resources
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-resources-headline">
            Knowledge Center
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl">
            Guides, tools, and resources to help you navigate the world of construction surety bonds
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2" data-testid="text-guides-section">Guides & Articles</h2>
              <p className="text-muted-foreground">In-depth resources for contractors at every level</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-3">{guide.category}</Badge>
                      <CardTitle className="text-xl mb-2" data-testid={`text-guide-${index}`}>
                        {guide.title}
                      </CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </div>
                    <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" data-testid={`button-guide-${index}`}>
                    {guide.downloadable ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </>
                    ) : (
                      <>
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2" data-testid="text-videos-section">Video Tutorials</h2>
              <p className="text-muted-foreground">Learn visually with our educational videos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-12 h-12 text-primary" />
                  </div>
                  <CardTitle className="text-lg" data-testid={`text-video-${index}`}>
                    {video.title}
                  </CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{video.duration}</Badge>
                    <Button variant="ghost" size="sm" data-testid={`button-video-${index}`}>
                      Watch Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2" data-testid="text-tools-section">Interactive Tools</h2>
              <p className="text-muted-foreground">Calculators and resources to help you make decisions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.link}>
                <Card className="hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-tool-${index}`}>
                  <CardHeader>
                    <CardTitle className="text-lg" data-testid={`text-tool-${index}`}>
                      {tool.title}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" data-testid={`button-tool-${index}`}>
                      Launch Tool
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-accent text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-xl mb-6 text-gray-100">
              Our team is here to help you navigate the bonding process
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/faq">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" data-testid="button-faq">
                  View FAQ
                </Button>
              </Link>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" data-testid="button-contact">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
