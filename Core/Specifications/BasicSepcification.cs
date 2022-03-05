using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class BasicSepcification<T> : ISpecification<T>
    {
        public BasicSepcification(){}
        

        public BasicSepcification(Expression<Func<T, bool>> criterial)
        {
            Criterial = criterial;
            
        }
        public Expression<Func<T, bool>> Criterial { get; }

        public List<Expression<Func<T, object>>> Includes { get; } = new List<Expression<Func<T, object>>>();

        protected void AddInclude(Expression<Func<T,object>> includeExpression){

            Includes.Add(includeExpression);
        }
    }
}
