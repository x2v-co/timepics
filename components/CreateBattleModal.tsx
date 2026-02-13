/**
 * Create Battle Modal
 * User interface for creating custom battles
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Bot, Swords, Sparkles, RefreshCw, Zap, Crown } from 'lucide-react';

interface ParadoxTopic {
  id: string;
  topic: string;
  description: string;
  factionA: {
    name: string;
    theme: string;
    perspective: string;
    keywords: string[];
  };
  factionB: {
    name: string;
    theme: string;
    perspective: string;
    keywords: string[];
  };
  era: string;
  tags: string[];
  controversyLevel: number;
}

interface CreateBattleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onBattleCreated: (battleId: string) => void;
  presets?: {
    factions: any[];
    agents: any[];
  };
}

type BattleMode = 'pvp' | 'pva' | 'ava';
type ParticipantConfig = {
  type: 'user' | 'agent';
  userId?: string;
  agentId?: string;
  factionId?: string;
};

export const CreateBattleModal: React.FC<CreateBattleModalProps> = ({
  open,
  onOpenChange,
  userId,
  onBattleCreated,
  presets
}) => {
  const [mode, setMode] = useState<BattleMode>('ava');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [useParadox, setUseParadox] = useState(false);
  const [paradoxTopics, setParadoxTopics] = useState<ParadoxTopic[]>([]);
  const [selectedParadoxTopic, setSelectedParadoxTopic] = useState<ParadoxTopic | null>(null);
  const [generatingTopics, setGeneratingTopics] = useState(false);
  const [participantA, setParticipantA] = useState<ParticipantConfig>({
    type: 'agent',
    agentId: 'historian',
    factionId: 'classical-rome'
  });
  const [participantB, setParticipantB] = useState<ParticipantConfig>({
    type: 'agent',
    agentId: 'futurist',
    factionId: 'tech-rome'
  });
  const [creating, setCreating] = useState(false);

  // Load paradox topics on mount
  useEffect(() => {
    if (open && paradoxTopics.length === 0) {
      loadParadoxTopics();
    }
  }, [open]);

  const loadParadoxTopics = async () => {
    try {
      const response = await fetch('/api/paradox?action=all');
      const data = await response.json();
      if (data.topics) {
        setParadoxTopics(data.topics);
      }
    } catch (error) {
      console.error('Failed to load paradox topics:', error);
    }
  };

  const generateNewTopics = async () => {
    setGeneratingTopics(true);
    try {
      const response = await fetch('/api/paradox?action=generate&category=soul-swap');
      const topic = await response.json();
      setParadoxTopics(prev => [topic, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Failed to generate topics:', error);
    } finally {
      setGeneratingTopics(false);
    }
  };

  const selectParadoxTopic = (topic: ParadoxTopic) => {
    setSelectedParadoxTopic(topic);
    setTopic(topic.topic);
    setDescription(topic.description);

    // Auto-select factions based on paradox topic
    if (presets?.factions) {
      const factionA = presets.factions.find((f: any) =>
        f.name.toLowerCase().includes(topic.factionA.name.split(' ')[0].toLowerCase())
      );
      const factionB = presets.factions.find((f: any) =>
        f.name.toLowerCase().includes(topic.factionB.name.split(' ')[0].toLowerCase())
      );

      if (factionA) {
        setParticipantA({ ...participantA, factionId: factionA.id });
      }
      if (factionB) {
        setParticipantB({ ...participantB, factionId: factionB.id });
      }
    }
  };

  const getModeIcon = (m: BattleMode) => {
    if (m === 'pvp') return <Users className="w-5 h-5" />;
    if (m === 'pva') return <Swords className="w-5 h-5" />;
    return <Bot className="w-5 h-5" />;
  };

  const getModeLabel = (m: BattleMode) => {
    if (m === 'pvp') return 'Player vs Player';
    if (m === 'pva') return 'Player vs Agent';
    return 'Agent vs Agent';
  };

  const getModeDescription = (m: BattleMode) => {
    if (m === 'pvp') return 'Challenge another player';
    if (m === 'pva') return 'Test your skills against AI';
    return 'Watch AI agents battle it out';
  };

  const handleCreate = async () => {
    if (!topic.trim()) {
      alert('Please select or enter a battle topic');
      return;
    }

    setCreating(true);

    try {
      // Update participants based on mode
      let finalParticipantA = { ...participantA };
      let finalParticipantB = { ...participantB };

      if (mode === 'pvp') {
        finalParticipantA = { type: 'user', userId, factionId: participantA.factionId };
        finalParticipantB = { type: 'user', factionId: participantB.factionId };
      } else if (mode === 'pva') {
        finalParticipantA = { type: 'user', userId, factionId: participantA.factionId };
        finalParticipantB = { type: 'agent', agentId: participantB.agentId, factionId: participantB.factionId };
      }

      const response = await fetch('/api/unified-battles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          mode,
          topic,
          description: description || `Battle: ${topic}`,
          participantA: finalParticipantA,
          participantB: finalParticipantB,
          rounds: 3,
          creatorUserId: userId,
          // v3: Mark if using paradox topic
          paradoxTopicId: selectedParadoxTopic?.id,
          tags: selectedParadoxTopic?.tags || ['paradox']
        })
      });

      const data = await response.json();

      if (data.success) {
        // Auto-start Agent vs Agent battles
        if (mode === 'ava') {
          await fetch('/api/unified-battles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'start',
              battleId: data.battle.id
            })
          });
        }

        onBattleCreated(data.battle.id);
        onOpenChange(false);

        // Reset form
        setTopic('');
        setDescription('');
      } else {
        alert(data.error || 'Failed to create battle');
      }
    } catch (error) {
      console.error('Failed to create battle:', error);
      alert('Failed to create battle');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Create New Battle
          </DialogTitle>
          <DialogDescription>
            Design your own timeline battle. Choose participants, factions, and watch history unfold.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Battle Mode Selection */}
          <div>
            <Label className="mb-3 block">Battle Mode</Label>
            <div className="grid grid-cols-3 gap-3">
              {(['ava', 'pva', 'pvp'] as BattleMode[]).map(m => (
                <Card
                  key={m}
                  className={`cursor-pointer transition-all ${
                    mode === m
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setMode(m)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">{getModeIcon(m)}</div>
                    <p className="font-medium text-sm mb-1">{getModeLabel(m)}</p>
                    <p className="text-xs text-gray-400">{getModeDescription(m)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Battle Topic */}
          <div>
            <Label htmlFor="topic">Battle Topic</Label>
            <Input
              id="topic"
              placeholder="What if Rome Never Fell?"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Description (Optional) */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe the battle scenario..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Paradox Topic Selection (v4 Feature) */}
          <div className="border border-purple-500/30 rounded-lg p-4 bg-purple-900/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <Label className="text-purple-300">Paradox Engine Topics (v4)</Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={generateNewTopics}
                disabled={generatingTopics}
                className="border-purple-500/50 text-purple-300"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${generatingTopics ? 'animate-spin' : ''}`} />
                {generatingTopics ? 'Generating...' : 'Generate New'}
              </Button>
            </div>

            <p className="text-xs text-gray-400 mb-3">
              Select a controversial paradox topic to drive engagement, or enter your own battle topic above.
            </p>

            {paradoxTopics.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 pr-4 max-h-48 overflow-y-auto">
                {paradoxTopics.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => selectParadoxTopic(t)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedParadoxTopic?.id === t.id
                          ? 'bg-purple-600 border-2 border-purple-400'
                          : 'bg-gray-800 border border-gray-700 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{t.topic}</p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {t.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-2">
                          <Badge variant="outline" className="text-xs">
                            🔥 {t.controversyLevel}/10
                          </Badge>
                          <span className="text-xs text-gray-500">{t.era}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {t.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {selectedParadoxTopic?.id === t.id && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-yellow-400">
                          <Crown className="w-3 h-3" />
                          <span>Auto-selects factions: {t.factionA.name} vs {t.factionB.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click "Generate New" to create paradox topics</p>
              </div>
            )}
          </div>

          {/* Participants Configuration */}
          <div>
            <Label className="mb-3 block">Participants & Factions</Label>
            <Tabs defaultValue="participant-a" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="participant-a">Participant A</TabsTrigger>
                <TabsTrigger value="participant-b">Participant B</TabsTrigger>
              </TabsList>

              <TabsContent value="participant-a" className="space-y-4">
                {mode === 'ava' && presets?.agents && (
                  <div>
                    <Label>Agent</Label>
                    <select
                      className="w-full mt-2 p-2 bg-gray-800 border border-gray-700 rounded"
                      value={participantA.agentId}
                      onChange={e =>
                        setParticipantA({ ...participantA, agentId: e.target.value })
                      }
                    >
                      {presets.agents.map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} - {agent.type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <Label>Faction</Label>
                  {presets?.factions && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {presets.factions.slice(0, 6).map(faction => (
                        <Card
                          key={faction.id}
                          className={`cursor-pointer transition-all ${
                            participantA.factionId === faction.id
                              ? 'border-purple-500 bg-purple-900/20'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                          onClick={() =>
                            setParticipantA({ ...participantA, factionId: faction.id })
                          }
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{faction.icon}</span>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{faction.name}</p>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  {faction.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="participant-b" className="space-y-4">
                {(mode === 'ava' || mode === 'pva') && presets?.agents && (
                  <div>
                    <Label>Agent</Label>
                    <select
                      className="w-full mt-2 p-2 bg-gray-800 border border-gray-700 rounded"
                      value={participantB.agentId}
                      onChange={e =>
                        setParticipantB({ ...participantB, agentId: e.target.value })
                      }
                    >
                      {presets.agents.map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} - {agent.type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <Label>Faction</Label>
                  {presets?.factions && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {presets.factions.slice(0, 6).map(faction => (
                        <Card
                          key={faction.id}
                          className={`cursor-pointer transition-all ${
                            participantB.factionId === faction.id
                              ? 'border-purple-500 bg-purple-900/20'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                          onClick={() =>
                            setParticipantB({ ...participantB, factionId: faction.id })
                          }
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{faction.icon}</span>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{faction.name}</p>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  {faction.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={creating}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || !topic.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {creating ? 'Creating...' : 'Create Battle'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
