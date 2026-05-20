'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ModuleViewer } from '@/components/learning/ModuleViewer';
import { ChevronLeftIcon } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  estimated_hours: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  learning_objectives: string[];
  content: string;
  sources: any[];
  is_completed: boolean;
  is_locked: boolean;
}

export default function ModuleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers = {
          'Authorization': `Bearer ${token || 'mock-token'}`,
          'x-user-id': userId || 'mock-user-id',
          'Content-Type': 'application/json',
        };

        const res = await fetch(`/api/learning/modules/${params.id}`, { headers });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Module not found');
          }
          throw new Error(`Failed to fetch module: ${res.status}`);
        }

        const data = await res.json();
        setModule(data.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(message);
        console.error('Error fetching module:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token || userId) {
      fetchModule();
    }
  }, [params.id, token, userId]);

  const handleComplete = async (moduleId: string, score?: number) => {
    try {
      setIsCompleting(true);

      const headers = {
        'Authorization': `Bearer ${token || 'mock-token'}`,
        'x-user-id': userId || 'mock-user-id',
        'Content-Type': 'application/json',
      };

      const res = await fetch(`/api/learning/modules/${moduleId}/complete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ assessment_score: score }),
      });

      if (!res.ok) {
        throw new Error(`Failed to complete module: ${res.status}`);
      }

      const data = await res.json();

      // Update local state
      if (module) {
        setModule({ ...module, is_completed: true });
      }

      // Show success message
      setCompletionMessage('Module completed! Great job! 🎉');

      // Redirect to next module or back to learning page
      setTimeout(() => {
        if (data.data?.next_module) {
          router.push(`/learning/modules/${data.data.next_module.id}`);
        } else {
          router.push('/learning');
        }
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete module';
      setError(message);
      console.error('Error completing module:', err);
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/learning" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Modules
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 font-semibold mb-2">Error</p>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/learning" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Modules
        </Link>
        <p className="text-gray-600">Module not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link href="/learning" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
        <ChevronLeftIcon className="w-5 h-5" />
        Back to Modules
      </Link>

      {/* Completion message */}
      {completionMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-semibold">{completionMessage}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      )}

      {/* Module content */}
      <ModuleViewer
        id={module.id}
        title={module.title}
        description={module.description}
        estimated_hours={module.estimated_hours}
        level={module.level}
        learning_objectives={module.learning_objectives}
        content={module.content}
        sources={module.sources}
        is_completed={module.is_completed}
        is_locked={module.is_locked}
        onComplete={handleComplete}
        isCompleting={isCompleting}
      />
    </div>
  );
}
