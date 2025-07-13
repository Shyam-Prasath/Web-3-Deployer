"use client";
import DeploymentVisual from "@/components/DeploymentVisual";
import { Button } from "@/components/ui/button";
import {
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2
} from "lucide-react";
import { useState } from "react";

// Add these to your component
const IPFS_API = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_API_KEY = 'Pinata Key';
const PINATA_SECRET_KEY = 'Pinata secret Key';

// Inside your component
const [ipfsUrl, setIpfsUrl] = useState('');
const [isUploading, setIsUploading] = useState(false);
const [uploadError, setUploadError] = useState('');

const uploadToIPFS = async () => {
  if (!content) {
    setUploadError('Content is empty');
    return;
  }

  setIsUploading(true);
  setUploadError('');

  try {
    // Create a file from the content
    const file = new Blob([content], { type: 'text/html' });
    const formData = new FormData();
    formData.append('file', file, `${domain || 'website'}.html`);

    const response = await fetch(IPFS_API, {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: formData,
    });

    const data = await response.json();
    if (data.IpfsHash) {
      const url = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
      setIpfsUrl(url);
    } else {
      throw new Error('Failed to get IPFS hash');
    }
  } catch (error) {
    console.error('IPFS upload error:', error);
    setUploadError('Failed to upload to IPFS');
  } finally {
    setIsUploading(false);
  }
};

// Add this button and display section to your CardContent
<CardContent>
  <div className="space-y-4">
    {/* Your existing domain and content inputs */}
    <div>
      <Label htmlFor="domain" className="text-lg text-gray-400">
        Domain
      </Label>
      <Input
        id="domain"
        placeholder="Enter your domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        className="mt-1 bg-[#0a0a0a] text-white border-gray-700"
        disabled={!!selectedWebpage}
      />
    </div>
    <div>
      <Label htmlFor="content" className="text-lg text-gray-400">
        Content
      </Label>
      <Textarea
        id="content"
        placeholder="Enter your HTML content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mt-1 min-h-[200px] font-mono text-sm bg-[#0a0a0a] text-white border-gray-700"
      />
    </div>

    {/* Your existing deploy button */}
    <Button
      onClick={selectedWebpage ? handleUpdate : handleDeploy}
      disabled={
        isDeploying ||
        !domain ||
        !content ||
        !isInitialized ||
        userId === null
      }
      size="lg"
      className="bg-blue-600 hover:bg-blue-500 text-white"
    >
      {isDeploying ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {selectedWebpage ? "Updating..." : "Deploying..."}
        </>
      ) : selectedWebpage ? (
        "Update Website"
      ) : (
        "Deploy to web 3 deployer"
      )}
    </Button>

    {/* New IPFS upload button */}
    <Button
      onClick={uploadToIPFS}
      disabled={isUploading || !content}
      size="lg"
      className="bg-purple-600 hover:bg-purple-500 text-white"
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Uploading to IPFS...
        </>
      ) : (
        "Upload to IPFS"
      )}
    </Button>

    {/* Error messages and URLs */}
    {deploymentError && (
      <p className="text-red-400 mt-2">{deploymentError}</p>
    )}
    {uploadError && (
      <p className="text-red-400 mt-2">{uploadError}</p>
    )}
    {deployedUrl && (
      <DeploymentVisual deployedUrl={deployedUrl} />
    )}
    {ipfsUrl && (
      <div className="mt-4 p-3 bg-[#0a0a0a] border border-gray-700 rounded">
        <p className="text-gray-400 mb-1">IPFS URL:</p>
        <a 
          href={ipfsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 break-all"
        >
          {ipfsUrl}
        </a>
      </div>
    )}
  </div>
</CardContent>