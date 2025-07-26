import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Scissors, Clock, IndianRupee } from 'lucide-react';
import { Service, CreateServiceData } from '../types';
import { apiService } from '../services/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateServiceData>();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm]);

  const fetchServices = async () => {
    try {
      const data = await apiService.getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];
    if (searchTerm) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredServices(filtered);
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      reset({
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description || '',
      });
    } else {
      setEditingService(null);
      reset({
        name: '',
        price: 0,
        duration: 5,
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    reset();
  };

  const onSubmit = async (data: CreateServiceData) => {
    try {
      if (editingService) {
        const updatedService = await apiService.updateService(editingService.id, data);
        setServices((prev) =>
          prev.map((service) =>
            service.id === editingService.id ? updatedService : service
          )
        );
        toast.success('Service updated successfully');
      } else {
        const newService = await apiService.createService(data);
        setServices((prev) => [...prev, newService]);
        toast.success('Service created successfully');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (serviceId: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await apiService.deleteService(serviceId);
        setServices((prev) => prev.filter((service) => service.id !== serviceId));
        toast.success('Service deleted successfully');
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
        <div className="card">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Service
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-salon-100 rounded-lg">
                  <Scissors className="w-6 h-6 text-salon-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(service)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <IndianRupee className="w-4 h-4 mr-2" />
                <span className="text-xl font-bold text-gray-900">{service.price}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{service.duration} minutes</span>
              </div>

              {service.description && (
                <p className="text-gray-600 text-sm">{service.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Scissors className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No services found</p>
        </div>
      )}

      {/* Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name *
                  </label>
                  <input
                    {...register('name', { required: 'Service name is required' })}
                    type="text"
                    className="input-field"
                    placeholder="Enter service name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    {...register('price', {
                      required: 'Price is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Price must not be less than 0' },
                      validate: (value) => !isNaN(value) || 'Price must be a valid number'
                    })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="input-field"
                    placeholder="Enter price"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    {...register('duration', {
                      required: 'Duration is required',
                      valueAsNumber: true,
                      min: { value: 5, message: 'Duration must not be less than 5 minutes' },
                      validate: (value) => !isNaN(value) || 'Duration must be a valid number'
                    })}
                    type="number"
                    min="5"
                    className="input-field"
                    placeholder="Enter duration in minutes"
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    className="input-field"
                    rows={3}
                    placeholder="Enter service description (optional)"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingService ? 'Update' : 'Create'} Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;