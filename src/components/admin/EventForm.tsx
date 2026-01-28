'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createEvent, updateEvent } from '@/actions/events';
import { toast } from 'sonner';
import type { Event, Category } from '@/types/database';

interface EventFormProps {
    event?: Event | null;
    categories: Category[];
    isEdit?: boolean;
}

export function EventForm({ event, categories, isEdit = false }: EventFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);

        let result;
        if (isEdit && event) {
            result = await updateEvent(event.id, formData);
        } else {
            result = await createEvent(formData);
        }

        if (result?.error) {
            toast.error(result.error);
            setIsLoading(false);
        } else if (result && 'success' in result && result.success) {
            toast.success('Event saved!');
            router.refresh();
        }
        // createEvent redirects on success
    }

    // Format date for datetime-local input
    const formatDateForInput = (dateStr: string | null | undefined) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 16);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <Link href="/admin/events">
                <Button variant="ghost" size="sm" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Events
                </Button>
            </Link>

            <Card className="glass">
                <CardHeader>
                    <CardTitle>{isEdit ? 'Edit Event' : 'Create New Event'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Question *</Label>
                            <Input
                                id="title"
                                name="title"
                                required
                                minLength={10}
                                maxLength={200}
                                placeholder="Will X happen by Y date?"
                                defaultValue={event?.title || ''}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Frame this as a clear Yes/No question (10-200 characters)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Provide context and resolution criteria..."
                                rows={4}
                                defaultValue={event?.description || ''}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category_id">Category *</Label>
                                <Select
                                    name="category_id"
                                    defaultValue={event?.category_id || ''}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.icon} {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    name="status"
                                    defaultValue={event?.status || 'draft'}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="deadline">Voting Deadline *</Label>
                                <Input
                                    id="deadline"
                                    name="deadline"
                                    type="datetime-local"
                                    required
                                    defaultValue={formatDateForInput(event?.deadline)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="resolution_date">Resolution Date</Label>
                                <Input
                                    id="resolution_date"
                                    name="resolution_date"
                                    type="datetime-local"
                                    defaultValue={formatDateForInput(event?.resolution_date)}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    When the outcome will be known
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_featured"
                                name="is_featured"
                                value="true"
                                defaultChecked={event?.is_featured || false}
                                disabled={isLoading}
                                className="h-4 w-4 rounded border-border"
                            />
                            <Label htmlFor="is_featured" className="font-normal">
                                Feature this event (shows prominently)
                            </Label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                className="gradient-oracle text-white flex-1"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    isEdit ? 'Update Event' : 'Create Event'
                                )}
                            </Button>
                            <Link href="/admin/events">
                                <Button type="button" variant="outline" disabled={isLoading}>
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
