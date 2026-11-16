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
import { DEMO_CUSTOMERS, DEMO_FACILITIES, DEMO_LANES } from '@/lib/data/mock-data';
import { tmsRepository } from '@/lib/services/tms-service';

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated?: () => void;
}

export function CreateOrderDialog({ open, onOpenChange, onOrderCreated }: CreateOrderDialogProps) {
  const [customerId, setCustomerId] = useState(DEMO_CUSTOMERS[0].id);
  const [originFacilityId, setOriginFacilityId] = useState(DEMO_FACILITIES[0].id);
  const [destinationFacilityId, setDestinationFacilityId] = useState(DEMO_FACILITIES[1].id);
  const [cargoDesc, setCargoDesc] = useState('Automotive Precision Transmission Units & Sensors');
  const [cargoCategory, setCargoCategory] = useState('Automotive Components');
  const [weightKg, setWeightKg] = useState('8500');
  const [volumeCbm, setVolumeCbm] = useState('32');
  const [vehicleType, setVehicleType] = useState('19ft Container');
  const [specialInstructions, setSpecialInstructions] = useState('Verify GPS seal before departure; transit via expressway.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const customer = DEMO_CUSTOMERS.find((c) => c.id === customerId);
      const originFac = DEMO_FACILITIES.find((f) => f.id === originFacilityId);
      const destFac = DEMO_FACILITIES.find((f) => f.id === destinationFacilityId);

      const pickupDeadline = new Date(Date.now() + 24 * 3600000).toISOString();
      const deliveryDeadline = new Date(Date.now() + 72 * 3600000).toISOString();

      tmsRepository.createOrder({
        organisation_id: 'org-apex-001',
        customer_id: customerId,
        customer_name: customer?.name || 'Customer Partner',
        order_number: `ORD-${Date.now().toString().slice(-4)}`,
        origin_facility_id: originFacilityId,
        origin_facility_name: originFac?.name,
        origin_city: originFac?.city || 'Gurgaon',
        destination_facility_id: destinationFacilityId,
        destination_facility_name: destFac?.name,
        destination_city: destFac?.city || 'Mumbai',
        pickup_address: originFac?.address || 'Origin Hub',
        delivery_address: destFac?.address || 'Destination Hub',
        cargo_description: cargoDesc,
        cargo_category: cargoCategory,
        cargo_weight_kg: Number(weightKg) || 5000,
        cargo_volume_cbm: Number(volumeCbm) || 20,
        required_vehicle_type: vehicleType,
        pickup_deadline: pickupDeadline,
        delivery_deadline: deliveryDeadline,
        special_instructions: specialInstructions,
        status: 'confirmed',
        estimated_freight_inr: 45000,
      });

      onOpenChange(false);
      if (onOrderCreated) onOrderCreated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Transportation Order</DialogTitle>
            <DialogDescription>
              Create a new customer freight consignment order for allocation and shipment consolidation.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Customer */}
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="customer">Customer Enterprise</Label>
              <select
                id="customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full text-sm bg-white border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {DEMO_CUSTOMERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Origin Facility */}
            <div className="space-y-1">
              <Label htmlFor="origin">Origin Facility / Loading Hub</Label>
              <select
                id="origin"
                value={originFacilityId}
                onChange={(e) => setOriginFacilityId(e.target.value)}
                className="w-full text-sm bg-white border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {DEMO_FACILITIES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Facility */}
            <div className="space-y-1">
              <Label htmlFor="destination">Destination Facility / Delivery Hub</Label>
              <select
                id="destination"
                value={destinationFacilityId}
                onChange={(e) => setDestinationFacilityId(e.target.value)}
                className="w-full text-sm bg-white border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {DEMO_FACILITIES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Cargo Description */}
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="cargoDesc">Cargo Description</Label>
              <Input
                id="cargoDesc"
                value={cargoDesc}
                onChange={(e) => setCargoDesc(e.target.value)}
                required
                placeholder="e.g. Precision CNC Machined Castings"
              />
            </div>

            {/* Cargo Weight */}
            <div className="space-y-1">
              <Label htmlFor="weightKg">Weight (KG)</Label>
              <Input
                id="weightKg"
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
                min={100}
                max={30000}
              />
            </div>

            {/* Cargo Volume */}
            <div className="space-y-1">
              <Label htmlFor="volumeCbm">Volume (CBM)</Label>
              <Input
                id="volumeCbm"
                type="number"
                value={volumeCbm}
                onChange={(e) => setVolumeCbm(e.target.value)}
                required
                min={1}
                max={100}
              />
            </div>

            {/* Vehicle Requirement */}
            <div className="space-y-1">
              <Label htmlFor="vehicleType">Vehicle Requirement</Label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full text-sm bg-white border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="Tata Ace">Tata Ace (1.2 Ton / 8 CBM)</option>
                <option value="14ft Eicher">14ft Eicher (5.0 Ton / 24 CBM)</option>
                <option value="19ft Container">19ft Container (9.0 Ton / 38 CBM)</option>
                <option value="32ft Multi-Axle">32ft Multi-Axle (18.5 Ton / 68 CBM)</option>
                <option value="40ft Trailer">40ft Trailer (28.0 Ton / 95 CBM)</option>
              </select>
            </div>

            {/* Cargo Category */}
            <div className="space-y-1">
              <Label htmlFor="category">Commodity Category</Label>
              <select
                id="category"
                value={cargoCategory}
                onChange={(e) => setCargoCategory(e.target.value)}
                className="w-full text-sm bg-white border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="Automotive Components">Automotive Components</option>
                <option value="Industrial Machinery">Industrial Machinery</option>
                <option value="Pharmaceuticals">Pharmaceuticals</option>
                <option value="FMCG & Consumer Goods">FMCG & Consumer Goods</option>
                <option value="Chemicals & Coatings">Chemicals & Coatings</option>
                <option value="Electronics & Electrical">Electronics & Electrical</option>
              </select>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="instructions">Special Handling Instructions</Label>
              <Input
                id="instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Temperature monitoring required; no transshipment allowed"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? 'Creating Order...' : 'Confirm & Create Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
