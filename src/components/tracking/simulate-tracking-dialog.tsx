'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrackingEventType, Shipment } from '@/types/tms';
import { tmsRepository } from '@/lib/services/tms-service';

interface SimulateTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventSimulated?: () => void;
  shipmentId?: string;
}

export function SimulateTrackingDialog({
  open,
  onOpenChange,
  onEventSimulated,
  shipmentId,
}: SimulateTrackingDialogProps) {
  const activeShipments = tmsRepository
    .getShipments()
    .filter((s) => ['dispatched', 'in_transit', 'at_risk', 'delayed', 'carrier_assigned'].includes(s.status));

  const [selectedShipmentId, setSelectedShipmentId] = useState(
    shipmentId || (activeShipments.length > 0 ? activeShipments[0].id : '')
  );
  const [eventType, setEventType] = useState<TrackingEventType>('checkpoint_reached');
  const [locationName, setLocationName] = useState('Kotputli FASTag Toll Plaza (NH-48)');
  const [city, setCity] = useState('Kotputli, Rajasthan');
  const [description, setDescription] = useState(
    'Passed automated RFID FASTag lane #3. Speed: 52 km/h. Consignment seals intact.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (newType: TrackingEventType) => {
    setEventType(newType);
    if (newType === 'checkpoint_reached') {
      setLocationName('Kotputli Toll Plaza (NH-48)');
      setCity('Kotputli, Rajasthan');
      setDescription('Passed automated RFID FASTag lane #3. Speed: 52 km/h. Consignment seals intact.');
    } else if (newType === 'delay_reported') {
      setLocationName('Jaipur Bypass Heavy Vehicle Diversion');
      setCity('Jaipur, Rajasthan');
      setDescription('Highway lane resurfacing stoppage. Traffic standstill ~90 mins. Updated ETA +2.5 hours.');
    } else if (newType === 'breakdown_reported') {
      setLocationName('KM 214 Service Shoulder');
      setCity('Udaipur Corridor');
      setDescription('Driver reported clutch pressure failure and radiator leakage. Vehicle stationary.');
    } else if (newType === 'arrived_destination_hub') {
      setLocationName('Bhiwandi Inward Unloading Bay');
      setCity('Mumbai, Maharashtra');
      setDescription('Vehicle arrived at security inbound gate. Barcode scanning initiated.');
    } else if (newType === 'delivered') {
      setLocationName('Customer Central Receiving Dock');
      setCity('Mumbai, Maharashtra');
      setDescription('Cargo offloaded. Receiver signed electronic Proof of Delivery (e-POD) with zero damages.');
    }
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipmentId) return;

    setIsSubmitting(true);
    try {
      tmsRepository.simulateTrackingEvent(
        selectedShipmentId,
        eventType,
        locationName,
        city,
        description
      );
      onOpenChange(false);
      if (onEventSimulated) onEventSimulated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <form onSubmit={handleSimulate}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Simulate Live Tracking Event</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                Demo Simulator
              </span>
            </DialogTitle>
            <DialogDescription>
              Inject simulated GPS, FASTag toll, or driver event updates to observe real-time risk re-scoring and workflow alerts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Shipment Select */}
            <div className="space-y-1">
              <Label htmlFor="shipment">Target In-Transit Shipment</Label>
              <select
                id="shipment"
                value={selectedShipmentId}
                onChange={(e) => setSelectedShipmentId(e.target.value)}
                className="w-full text-sm bg-white border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              >
                {activeShipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shipment_number} ({s.origin_city} → {s.destination_city}) — [{s.status.toUpperCase()}]
                  </option>
                ))}
              </select>
            </div>

            {/* Event Type */}
            <div className="space-y-1">
              <Label htmlFor="eventType">Telemetry Event Type</Label>
              <select
                id="eventType"
                value={eventType}
                onChange={(e) => handleTypeChange(e.target.value as TrackingEventType)}
                className="w-full text-sm bg-white border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="checkpoint_reached">Checkpoint Reached (FASTag / RFID Ping)</option>
                <option value="in_transit_update">In-Transit Status Ping</option>
                <option value="delay_reported">Transit Delay Reported (Stoppage)</option>
                <option value="breakdown_reported">Vehicle Mechanical Breakdown (Triggers AI Rescue)</option>
                <option value="arrived_destination_hub">Arrived at Destination Hub Gate</option>
                <option value="delivered">Delivered & Signed Off (e-POD)</option>
              </select>
            </div>

            {/* Location & City */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="location">Checkpoint / Hub Name</Label>
                <Input
                  id="location"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="city">City / State</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label htmlFor="desc">Event Telematics Description</Label>
              <Input
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedShipmentId}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {isSubmitting ? 'Simulating Event...' : 'Inject Simulated Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
