module Api
  module V1
    class YourResourcesController < ApplicationController
      def index
        @resources = YourResource.all
        render json: @resources
      end

      def show
        @resource = YourResource.find(params[:id])
        render json: @resource
      end

      def create
        @resource = YourResource.new(resource_params)
        if @resource.save
          render json: @resource, status: :created
        else
          render json: @resource.errors, status: :unprocessable_entity
        end
      end

      def update
        @resource = YourResource.find(params[:id])
        if @resource.update(resource_params)
          render json: @resource
        else
          render json: @resource.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @resource = YourResource.find(params[:id])
        @resource.destroy
        head :no_content
      end

      private

      def resource_params
        params.require(:your_resource).permit(:attribute1, :attribute2)
      end
    end
  end
end
