ActiveSupport.on_load(:active_record) do
  ActiveRecord::Base.attributes_for_inspect = nil
end