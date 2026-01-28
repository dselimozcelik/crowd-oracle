'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ThumbsUp, ThumbsDown, Loader2, Check } from 'lucide-react';
import { castVote } from '@/actions/vote';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { ConfidenceLevel, Vote } from '@/types/database';
import { CONFIDENCE_LEVELS } from '@/lib/constants';

interface VotingPanelProps {
    eventId: string;
    existingVote: Vote | null;
    yesCount: number;
    noCount: number;
    weightedYes: number;
    weightedNo: number;
    isActive: boolean;
}

export function VotingPanel({
    eventId,
    existingVote,
    yesCount,
    noCount,
    weightedYes,
    weightedNo,
    isActive,
}: VotingPanelProps) {
    const [isVoting, setIsVoting] = useState(false);
    const [selectedPrediction, setSelectedPrediction] = useState<boolean | null>(null);
    const [confidence, setConfidence] = useState<ConfidenceLevel>('medium');

    const totalVotes = yesCount + noCount;
    const rawYesPct = totalVotes > 0 ? (yesCount / totalVotes) * 100 : 50;
    const totalWeight = weightedYes + weightedNo;
    const weightedYesPct = totalWeight > 0 ? (weightedYes / totalWeight) * 100 : 50;

    async function handleVote() {
        if (selectedPrediction === null) {
            toast.error('Please select Yes or No');
            return;
        }

        setIsVoting(true);
        const result = await castVote(eventId, selectedPrediction, confidence);

        if (result.error) {
            toast.error(result.error);
            setIsVoting(false);
        } else {
            toast.success('Vote recorded!');
        }
    }

    if (existingVote) {
        return (
            <Card className="p-6 glass border-oracle-500/20">
                <div className="flex items-center gap-2 mb-4">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="font-medium">You predicted</span>
                    <span className={cn(
                        "font-bold",
                        existingVote.prediction ? "text-yes" : "text-no"
                    )}>
                        {existingVote.prediction ? 'YES' : 'NO'}
                    </span>
                </div>
                <ResultsBar
                    rawYesPct={rawYesPct}
                    weightedYesPct={weightedYesPct}
                    totalVotes={totalVotes}
                />
            </Card>
        );
    }

    if (!isActive) {
        return (
            <Card className="p-6 glass">
                <p className="text-muted-foreground text-center">Voting is closed</p>
                <ResultsBar
                    rawYesPct={rawYesPct}
                    weightedYesPct={weightedYesPct}
                    totalVotes={totalVotes}
                />
            </Card>
        );
    }

    return (
        <Card className="p-6 glass">
            <h3 className="font-semibold mb-4">Make Your Prediction</h3>

            {/* Vote Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                        "h-20 text-lg transition-all",
                        selectedPrediction === true
                            ? "gradient-yes text-white border-0 scale-105"
                            : "hover:border-yes/50"
                    )}
                    onClick={() => setSelectedPrediction(true)}
                    disabled={isVoting}
                >
                    <ThumbsUp className="w-6 h-6 mr-2" />
                    YES
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                        "h-20 text-lg transition-all",
                        selectedPrediction === false
                            ? "gradient-no text-white border-0 scale-105"
                            : "hover:border-no/50"
                    )}
                    onClick={() => setSelectedPrediction(false)}
                    disabled={isVoting}
                >
                    <ThumbsDown className="w-6 h-6 mr-2" />
                    NO
                </Button>
            </div>

            {/* Confidence Level */}
            <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">
                    How confident are you?
                </label>
                <Select
                    value={confidence}
                    onValueChange={(v) => setConfidence(v as ConfidenceLevel)}
                    disabled={isVoting}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {CONFIDENCE_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                                {level.label} - {level.description}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Submit */}
            <Button
                className="w-full gradient-oracle text-white"
                size="lg"
                onClick={handleVote}
                disabled={selectedPrediction === null || isVoting}
            >
                {isVoting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Recording vote...
                    </>
                ) : (
                    'Submit Prediction'
                )}
            </Button>

            {/* Current Results Preview */}
            {totalVotes > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                    <ResultsBar
                        rawYesPct={rawYesPct}
                        weightedYesPct={weightedYesPct}
                        totalVotes={totalVotes}
                    />
                </div>
            )}
        </Card>
    );
}

function ResultsBar({
    rawYesPct,
    weightedYesPct,
    totalVotes
}: {
    rawYesPct: number;
    weightedYesPct: number;
    totalVotes: number;
}) {
    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
                {totalVotes} predictions
            </div>

            {/* Raw Results */}
            <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Raw Result</span>
                    <span>{rawYesPct.toFixed(1)}% Yes</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                    <div
                        className="h-full bg-yes transition-all duration-500"
                        style={{ width: `${rawYesPct}%` }}
                    />
                    <div
                        className="h-full bg-no transition-all duration-500"
                        style={{ width: `${100 - rawYesPct}%` }}
                    />
                </div>
            </div>

            {/* Weighted Results */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-oracle-400 font-medium">Weighted Result</span>
                    <span className="text-oracle-400 font-medium">{weightedYesPct.toFixed(1)}% Yes</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                    <div
                        className="h-full bg-yes transition-all duration-500"
                        style={{ width: `${weightedYesPct}%` }}
                    />
                    <div
                        className="h-full bg-no transition-all duration-500"
                        style={{ width: `${100 - weightedYesPct}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
