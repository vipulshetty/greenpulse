import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Upload, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PlantDiseaseDetectorProps {
  className?: string;
}

const PlantDiseaseDetector: React.FC<PlantDiseaseDetectorProps> = ({ className }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    disease: string;
    confidence: number;
    recommendations: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      // Fallback to file upload if camera access fails
      document.getElementById('file-upload')?.click();
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        closeCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call for disease detection
    setTimeout(() => {
      // Mock analysis results - in a real app, this would come from an API
      const mockResults = [
        {
          disease: "Healthy Plant",
          confidence: 92,
          recommendations: [
            "Continue current care routine",
            "Maintain consistent watering schedule",
            "Ensure adequate sunlight exposure"
          ]
        },
        {
          disease: "Powdery Mildew",
          confidence: 85,
          recommendations: [
            "Apply fungicide treatment immediately",
            "Improve air circulation around plant",
            "Reduce humidity levels",
            "Remove affected leaves"
          ]
        },
        {
          disease: "Leaf Spot",
          confidence: 78,
          recommendations: [
            "Remove infected leaves",
            "Apply copper-based fungicide",
            "Water at soil level, not on leaves",
            "Ensure proper spacing between plants"
          ]
        }
      ];
      
      // Randomly select a mock result for demonstration
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysisResult(randomResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetDetector = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className={className}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Plant Disease Detector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!capturedImage && !analysisResult && (
              <div className="flex flex-col items-center gap-4">
                <Button 
                  onClick={openCamera}
                  className="w-full py-6"
                  variant="outline"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Take Photo of Plant
                </Button>
                
                <div className="relative w-full">
                  <Button 
                    variant="ghost" 
                    className="w-full text-muted-foreground"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Or upload an image
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            )}
            
            <AnimatePresence>
              {isCameraOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button onClick={captureImage} size="lg" className="rounded-full h-14 w-14 p-0">
                      <Camera className="h-6 w-6" />
                    </Button>
                    <Button onClick={closeCamera} variant="outline" size="lg" className="rounded-full h-14 w-14 p-0">
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {capturedImage && !analysisResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <img 
                      src={capturedImage} 
                      alt="Captured plant" 
                      className="w-full rounded-lg border"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={analyzeImage} className="flex-1">
                      <Scan className="mr-2 h-4 w-4" />
                      Analyze for Diseases
                    </Button>
                    <Button onClick={resetDetector} variant="outline">
                      Retake Photo
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 text-center py-8"
                >
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-muted-foreground">Analyzing plant health...</p>
                  <Progress value={75} className="w-full" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <Alert className={analysisResult.disease === "Healthy Plant" ? "border-green-500" : "border-red-500"}>
                    <AlertDescription>
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 h-3 w-3 rounded-full ${analysisResult.disease === "Healthy Plant" ? "bg-green-500" : "bg-red-500"}`} />
                        <div>
                          <h3 className="font-medium">{analysisResult.disease}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Confidence: {analysisResult.confidence}%
                          </p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                  
                  {analysisResult.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Button onClick={resetDetector} variant="outline" className="w-full">
                    Analyze Another Plant
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantDiseaseDetector;